function Services() {
  const services = [
    {
      id: 1,
      name: 'Limpieza y Profilaxis',
      description:
        'Eliminación de placa y cálculo dental para mantener una salud bucal óptima.',
      image:
        'https://www.clinicadentalbarcelona.com/wp-content/uploads/2021/08/profilaxis-1-1024x455.png',
    },
    {
      id: 2,
      name: 'Tratamiento de Caries',
      description:
        'Restauración dental con materiales de última generación para reparar caries.',
      image:
        'https://sevilladental.net/wp-content/uploads/2022/06/tratamiento-para-caries.jpg',
    },
    {
      id: 3,
      name: 'Ortodoncia',
      description:
        'Alineación dental con brackets metálicos, cerámicos o alineadores invisibles.',
      image:
        'https://images.squarespace-cdn.com/content/v1/59303b953e00bebc0feaff9f/d6df1776-ac35-4094-b353-e4d9b9087682/ortodoncia-clinica-dental-murcia.jpeg',
    },
    {
      id: 4,
      name: 'Endodoncia',
      description:
        'Tratamiento de conductos radiculares para preservar piezas dentales afectadas.',
      image:
        'https://www.belodonte.es/wp-content/uploads/2022/10/endodoncia.jpg',
    },
    {
      id: 5,
      name: 'Odontología Estética',
      description:
        'Blanqueamiento dental, carillas y tratamientos para una sonrisa perfecta.',
      image:
        'https://www.ragaortodoncia.com/wp-content/uploads/2017/11/brackets-esteticos-800x350.jpg',
    },
    {
      id: 6,
      name: 'Implantes Dentales',
      description:
        'Colocación de implantes de titanio para reemplazar piezas dentales perdidas.',
      image:
        'https://images.squarespace-cdn.com/content/v1/59303b953e00bebc0feaff9f/ca4e0045-3162-4b38-8559-e60a83728413/implante-dental-murcia.jpg',
    },
  ]

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="page-title">
          Nuestro Portafolio de Servicios
        </h1>

        <p className="subtitle">
          Contamos con tratamientos modernos para tu salud dental.
        </p>
      </div>

      {services.length > 0 ? (
        <div className="row g-4">
          {services.map((service) => (
            <div className="col-md-4" key={service.id}>
              <div className="card shadow service-card h-100">

                <div className="service-image-frame">
                  <img
                    src={service.image}
                    alt={`Imagen de ${service.name}`}
                    className="service-image"
                    loading="lazy"
                  />
                </div>

                <div className="card-body">
                  <h5 className="card-title fw-bold">
                    {service.name}
                  </h5>

                  <p className="card-text text-muted">
                    {service.description}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center" role="alert">
          <h5>No hay servicios disponibles</h5>
          <p>Por favor, intenta más tarde.</p>
        </div>
      )}
    </div>
  )
}

export default Services