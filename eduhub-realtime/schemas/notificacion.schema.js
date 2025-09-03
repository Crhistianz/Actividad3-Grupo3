import mongoose from "mongoose";

const NotificacionSchema = new mongoose.Schema(
  {
    tipo: { type: String, enum: ["pedido", "pago"], required: true },
    canal: { type: String, enum: ["logistica", "cliente"], required: true },
    pedidoId: { type: Number, required: true },
    cliente: { id: Number, nombre: String, correo: String },
    fecha: { type: Date, default: Date.now },
    montoTotal: { type: Number, default: 0 },
    leido: { type: Boolean, default: false },
    fechaLeido: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Notificacion", NotificacionSchema);
