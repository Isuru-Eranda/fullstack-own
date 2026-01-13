const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const Snack = require('../models/Snack');
const Purchase = require('../models/Purchase');
const Order = require('../models/Order');

// Helper to render a PDF receipt into base64
function generateReceiptBase64({ user, bookings = [], purchase = null }) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const result = Buffer.concat(chunks);
        resolve(result.toString('base64'));
      });

      // Colors
      const primaryColor = '#1a365d'; // Dark blue
      const secondaryColor = '#2d3748'; // Gray
      const accentColor = '#3182ce'; // Blue
      const textColor = '#1a202c'; // Dark gray

      // Header with logo placeholder
      doc.rect(0, 0, doc.page.width, 100).fill(primaryColor);
      doc.fillColor('white').fontSize(28).font('Helvetica-Bold').text('ENIMATE', 50, 30, { align: 'left' });
      doc.fontSize(12).font('Helvetica').text('Cinema & Entertainment', 50, 60);
      doc.fontSize(10).text('Your Ultimate Movie Experience', 50, 75);

      // Receipt title
      doc.fillColor(textColor).fontSize(20).font('Helvetica-Bold').text('RECEIPT', 0, 120, { align: 'center' });
      doc.moveDown(0.5);

      // Customer and date info
      doc.fontSize(11).font('Helvetica').fillColor(textColor);
      if (user) {
        doc.text(`Customer: ${user.name || user.email || user._id}`, 50, 160);
      }
      doc.text(`Order Date: ${new Date().toLocaleString()}`, 50, 175);
      doc.text(`Receipt Generated: ${new Date().toLocaleString()}`, 50, 190);

      let yPosition = 220;
      let grandTotal = 0;

      // Bookings section
      if (bookings && bookings.length) {
        doc.moveTo(50, yPosition).lineTo(545, yPosition).stroke(accentColor);
        yPosition += 10;
        doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor).text('MOVIE TICKETS', 50, yPosition);
        yPosition += 20;

        bookings.forEach((b, idx) => {
          const showInfo = b.showtimeInfo || {};
          doc.fontSize(12).font('Helvetica-Bold').fillColor(textColor).text(`${idx + 1}. Booking Reference: ${b._id}`, 50, yPosition);
          yPosition += 15;
          doc.fontSize(11).font('Helvetica').fillColor(secondaryColor).text(`Movie: ${showInfo.movieTitle || 'N/A'}`, 70, yPosition);
          yPosition += 15;
          doc.text(`Showtime: ${new Date(showInfo.startTime || b.createdAt || Date.now()).toLocaleString()}`, 70, yPosition);
          yPosition += 15;
          if (b.seats && b.seats.length) {
            doc.text(`Seats: ${b.seats.join(', ')}`, 70, yPosition);
            yPosition += 15;
          }
          doc.fontSize(12).font('Helvetica-Bold').fillColor(accentColor).text(`Price: LKR ${Number(b.totalPrice || 0).toLocaleString()}`, 70, yPosition);
          yPosition += 20;
          grandTotal += Number(b.totalPrice || 0);
        });
        yPosition += 10;
      }

      // Snacks/Purchases section
      if (purchase) {
        doc.moveTo(50, yPosition).lineTo(545, yPosition).stroke(accentColor);
        yPosition += 10;
        doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor).text('CONCESSION ITEMS', 50, yPosition);
        yPosition += 20;

        purchase.items.forEach((it, idx) => {
          const lineTotal = Number(it.price || 0) * Number(it.quantity || 0);
          doc.fontSize(11).font('Helvetica').fillColor(textColor).text(`${idx + 1}. ${it.name}`, 50, yPosition);
          doc.text(`Quantity: ${it.quantity} × LKR ${Number(it.price || 0).toLocaleString()}`, 70, yPosition + 15);
          doc.fontSize(12).font('Helvetica-Bold').fillColor(accentColor).text(`Subtotal: LKR ${lineTotal.toLocaleString()}`, 70, yPosition + 30);
          yPosition += 50;
          grandTotal += lineTotal;
        });

        if (purchase._id) {
          doc.fontSize(10).font('Helvetica').fillColor(secondaryColor).text(`Purchase ID: ${purchase._id}`, 50, yPosition);
          yPosition += 15;
        }
        yPosition += 10;
      }

      // Total section
      doc.moveTo(50, yPosition).lineTo(545, yPosition).stroke(primaryColor);
      yPosition += 15;
      doc.fontSize(16).font('Helvetica-Bold').fillColor(primaryColor).text(`GRAND TOTAL: LKR ${grandTotal.toLocaleString()}`, 50, yPosition, { align: 'right' });

      // Footer
      const footerY = doc.page.height - 100;
      doc.moveTo(50, footerY).lineTo(545, footerY).stroke(secondaryColor);
      doc.fontSize(9).font('Helvetica').fillColor(secondaryColor).text('Thank you for choosing Enimate!', 50, footerY + 10, { align: 'center' });
      doc.text('For any inquiries, contact us at support@enimate.com', 50, footerY + 25, { align: 'center' });
      doc.text('Terms & Conditions: Tickets are non-refundable. Valid only for the specified showtime.', 50, footerY + 40, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

exports.checkout = async (req, res) => {
  const user = req.user;
  const { items = [] } = req.body;

  if (!user) return res.status(401).json({ message: 'Authentication required' });
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'No items provided' });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const ticketItems = items.filter(i => i.type === 'ticket');
    const snackItems = items.filter(i => i.type !== 'ticket');

    const createdBookings = [];
    const createdBookingIds = [];
    let bookingsTotal = 0;

    // Process tickets: validate showtime and seats, reserve seats, create bookings
    for (const t of ticketItems) {
      const meta = t.meta || {};
      const showtimeId = meta.showtimeId;
      if (!showtimeId) {
        await session.abortTransaction();
        return res.status(400).json({ message: 'ticket missing showtimeId' });
      }

      // populate movie for receipt display
      const showtime = await Showtime.findById(showtimeId).populate('movieId').session(session);
      if (!showtime) {
        await session.abortTransaction();
        return res.status(404).json({ message: 'Showtime not found' });
      }

      const seats = meta.seats || [];
      const totalTickets = Number(meta.adultCount || 0) + Number(meta.childCount || 0);
      if (seats.length !== totalTickets) {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Seat count must match ticket count' });
      }

      // Check seat conflicts
      const conflict = seats.find(s => showtime.bookedSeats.includes(s));
      if (conflict) {
        await session.abortTransaction();
        return res.status(409).json({ message: `Seat ${conflict} already booked` });
      }

      if (showtime.seatsAvailable < totalTickets) {
        await session.abortTransaction();
        return res.status(400).json({ message: 'Not enough seats available' });
      }

      const adultPrice = Number(showtime.price) || 0;
      const childPrice = adultPrice * 0.5;
      const totalPrice = Number(meta.adultCount || 0) * adultPrice + Number(meta.childCount || 0) * childPrice;

      // Reserve seats and update showtime
      showtime.bookedSeats.push(...seats);
      showtime.seatsAvailable = showtime.seatsAvailable - totalTickets;
      await showtime.save({ session });

      const bookingDocs = await Booking.create([
        {
          userId: user._id,
          showtimeId: showtime._id,
          seats,
          adultCount: meta.adultCount || 0,
          childCount: meta.childCount || 0,
          totalPrice,
        },
      ], { session });
      // attach showtime/movie info for receipt
      const bd = bookingDocs[0].toObject();
      bd.showtimeInfo = {
        startTime: showtime.startTime,
        movieTitle: showtime.movieId?.title || showtime.movieId || '',
        hallName: showtime.hallId || '',
        cinemaName: showtime.cinemaId || '',
      };
      createdBookings.push(bd);
      createdBookingIds.push(bookingDocs[0]._id);
      bookingsTotal += Number(totalPrice || 0);
    }

    let purchaseDoc = null;
    if (snackItems.length > 0) {
      let total = 0;
      const processedItems = [];
      for (const it of snackItems) {
        // find by snackId, productId or id (cart uses `id`)
        const identifier = it.snackId || it.productId || it.id;
        let snack = null;
        if (identifier) {
          // if looks like a Mongo ObjectId (24 hex chars) try findById first
          const maybeObjectId = typeof identifier === 'string' && /^[0-9a-fA-F]{24}$/.test(identifier);
          if (maybeObjectId) {
            snack = await Snack.findById(identifier).session(session);
          }
          // fallback to ProductId match
          if (!snack) {
            snack = await Snack.findOne({ ProductId: identifier }).session(session);
          }
        }
        if (!snack) {
          await session.abortTransaction();
          return res.status(404).json({ message: `Snack not found: ${it.productId || it.snackId}` });
        }
        const qty = Number(it.quantity) || it.qty || 0;
        if (qty <= 0) {
          await session.abortTransaction();
          return res.status(400).json({ message: 'Invalid snack quantity' });
        }
        if (snack.ProductQuantity < qty) {
          await session.abortTransaction();
          return res.status(400).json({ message: `Insufficient stock for ${snack.ProductName}` });
        }

        snack.ProductQuantity = snack.ProductQuantity - qty;
        await snack.save({ session });

        const price = Number(snack.ProductPrice) || 0;
        total += price * qty;
        processedItems.push({ snackId: snack._id, productId: snack.ProductId, name: snack.ProductName, price, quantity: qty });
      }

      const purchaseDocs = await Purchase.create([
        {
          userId: user._id,
          items: processedItems,
          totalPrice: total,
        },
      ], { session });
      purchaseDoc = purchaseDocs[0];
    }
    // Create Order linking bookings and purchase within the same transaction
    const orderTotal = bookingsTotal + (purchaseDoc ? Number(purchaseDoc.totalPrice || 0) : 0);

    // Generate PDF receipt
    const receiptBase64 = await generateReceiptBase64({ user, bookings: createdBookings, purchase: purchaseDoc });

    const orderDocs = await Order.create([
      {
        userId: user._id,
        bookings: createdBookingIds,
        purchase: purchaseDoc ? purchaseDoc._id : null,
        totalPrice: orderTotal,
        receipt: receiptBase64,
      },
    ], { session });
    const orderDoc = orderDocs[0];

    await session.commitTransaction();
    session.endSession();

    // Populate order for response
    const populatedOrder = await Order.findById(orderDoc._id).populate({ path: 'bookings', populate: { path: 'showtimeId', populate: { path: 'movieId' } } }).populate('purchase');

    res.status(201).json({ success: true, order: populatedOrder, receipt: receiptBase64 });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Checkout error:', err);
    res.status(500).json({ message: 'Server error during checkout' });
  }
};
