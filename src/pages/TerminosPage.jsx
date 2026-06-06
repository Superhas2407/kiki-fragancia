import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const SECTIONS = [
  {
    title: '1. Identificación',
    body: `KiKi Fragancia es una tienda venezolana de perfumería de lujo con sede en CC Todo Tecnología, Local #29, Av. Francisco de Miranda, Los Cortijos, Caracas, Venezuela. Operamos bajo las leyes de la República Bolivariana de Venezuela.

Contacto: @kiki_fragancia (Instagram) · 0414-911-2002 (WhatsApp).`,
  },
  {
    title: '2. Objeto',
    body: `Estos Términos y Condiciones regulan el acceso y uso del sitio web kikifragancia.com, así como la compra de fragancias originales y productos relacionados a través de nuestros canales de venta (sitio web, WhatsApp e Instagram).

Al navegar por el sitio o realizar un pedido, aceptas las presentes condiciones en su totalidad.`,
  },
  {
    title: '3. Productos',
    body: `Todos los productos ofrecidos en kikifragancia.com son fragancias 100% originales y verificadas, provenientes de las mejores casas del mundo.

Las imágenes, descripciones y notas olfativas son referenciales. Nos reservamos el derecho de modificar el catálogo, los precios y la disponibilidad sin previo aviso.`,
  },
  {
    title: '4. Precios y moneda',
    body: `Los precios se expresan en moneda extranjera como referencia (REF). El pago en divisa aplica exclusivamente para precios promocionales o precios especiales.

El pago en bolívares (Bs.) se realiza según la tasa BCV Euro vigente al momento del pago.

KiKi Fragancia no es responsable de variaciones cambiarias entre el momento del pedido y el momento del pago. El precio confirmado en el momento de la orden es el que aplica.`,
  },
  {
    title: '5. Proceso de pedido',
    body: `Los pedidos se gestionan a través de WhatsApp (+58 414-911-2002). Al iniciar una conversación con nosotros:

• Confirmarás la fragancia, tamaño y cantidad.
• Recibirás el monto total y las instrucciones de pago.
• El pedido se reserva una vez confirmado el pago.

KiKi Fragancia no está obligada a aceptar un pedido hasta que el pago haya sido verificado.`,
  },
  {
    title: '6. Envíos',
    body: `Realizamos envíos a todo el territorio nacional venezolano. Los tiempos y costos de envío se informan al momento de confirmar el pedido según la ciudad de destino.

Para pedidos especiales como el Día del Padre u otras campañas, se indica una fecha límite de pedido para garantizar la entrega en tiempo.`,
  },
  {
    title: '7. Devoluciones y cambios',
    body: `Debido a la naturaleza de los productos de perfumería, no se aceptan devoluciones de frascos abiertos o usados.

Aceptamos cambios o devoluciones únicamente en los siguientes casos:
• Producto recibido en mal estado o defectuoso (envases rotos, sellado violado).
• Error en el producto enviado (fragancia distinta a la pedida).

Para gestionar un cambio, el cliente debe contactarnos en un plazo máximo de 48 horas tras recibir el pedido, con foto o video como evidencia. El producto debe estar en su empaque original, sin abrir.`,
  },
  {
    title: '8. Privacidad y cookies',
    body: `El sitio web de KiKi Fragancia utiliza cookies estrictamente funcionales para recordar tus preferencias de moneda, tema visual y estado de sesión. No utilizamos cookies de rastreo de terceros ni publicidad comportamental.

Los datos de contacto que compartes a través de WhatsApp (nombre, número, dirección de entrega) son utilizados únicamente para gestionar tu pedido y no son cedidos a terceros.`,
  },
  {
    title: '9. Propiedad intelectual',
    body: `Todo el contenido de kikifragancia.com — incluyendo el diseño, logotipo, textos, fotografías y código fuente — es propiedad de KiKi Fragancia o de sus respectivos titulares con licencia de uso.

Está prohibida la reproducción, distribución o uso comercial de cualquier contenido sin autorización escrita previa.`,
  },
  {
    title: '10. Limitación de responsabilidad',
    body: `KiKi Fragancia no será responsable por daños indirectos, pérdidas de datos ni por interrupciones del servicio derivadas de causas ajenas a nuestra operación (cortes de luz, fallas del operador, casos de fuerza mayor).

Hacemos el mayor esfuerzo por mantener la información del sitio actualizada y precisa, pero no garantizamos su exactitud en todo momento.`,
  },
  {
    title: '11. Modificaciones',
    body: `Nos reservamos el derecho de actualizar estos Términos y Condiciones en cualquier momento. Los cambios entran en vigencia desde su publicación en el sitio web. El uso continuado del sitio implica la aceptación de las condiciones vigentes.`,
  },
  {
    title: '12. Legislación aplicable',
    body: `Estos Términos y Condiciones se rigen por las leyes de la República Bolivariana de Venezuela. Cualquier disputa será resuelta ante los tribunales competentes de la ciudad de Caracas.`,
  },
]

export default function TerminosPage() {
  return (
    <main className="terminos-page">
      <Helmet>
        <title>Términos y Condiciones · KiKi Fragancia</title>
        <meta name="description" content="Términos y condiciones de uso, política de ventas, devoluciones y privacidad de KiKi Fragancia, perfumería de lujo venezolana." />
        <link rel="canonical" href="https://kikifragancia.com/terminos-y-condiciones" />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="kiki-container terminos-inner">
        <Link to="/" className="terminos-back">← Volver al inicio</Link>

        <header className="terminos-header">
          <p className="terminos-eyebrow">Legal</p>
          <h1 className="terminos-title">Términos y Condiciones</h1>
          <p className="terminos-date">Última actualización: junio 2026</p>
        </header>

        <div className="terminos-body">
          {SECTIONS.map(s => (
            <section key={s.title} className="terminos-section">
              <h2 className="terminos-section-title">{s.title}</h2>
              {s.body.split('\n\n').map((para, i) => (
                <p key={i} className="terminos-para">{para}</p>
              ))}
            </section>
          ))}
        </div>

        <footer className="terminos-footer">
          <p>¿Preguntas? Escríbenos por{' '}
            <a
              href="https://wa.me/584149112002?text=Hola%20Kiki!%20Tengo%20una%20pregunta%20sobre%20los%20t%C3%A9rminos%20y%20condiciones."
              target="_blank"
              rel="noopener noreferrer"
              className="terminos-wa-link"
            >WhatsApp</a>.
          </p>
        </footer>
      </div>
    </main>
  )
}
