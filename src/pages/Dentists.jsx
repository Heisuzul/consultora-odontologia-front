function Dentists() {
  const dentists = [
    {
      id: 1,
      name: 'Dra. Laura Gómez',
      specialty: 'Ortodoncia',
      description:
        'Especialista en alineación dental y tratamientos modernos.',
      image:
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2'
    },
    {
      id: 2,
      name: 'Dr. Carlos Ramírez',
      specialty: 'Cirugía Oral',
      description:
        'Experto en procedimientos quirúrgicos y salud oral.',
      image:
        'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d'
    },
    {
      id: 3,
      name: 'Dra. Sofía Martínez',
      specialty: 'Odontología Estética',
      description:
        'Tratamientos estéticos para una sonrisa natural.',
      image:
        'https://images.unsplash.com/photo-1594824476967-48c8b964273f'
    }
  ]

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="page-title">
          Nuestro Equipo Odontológico
        </h1>

        <p className="subtitle">
          Profesionales comprometidos con tu salud dental.
        </p>
      </div>

      <div className="row g-4">
        {dentists.map((dentist) => (
          <div className="col-md-4" key={dentist.id}>
            <div className="card shadow dentist-card h-100">
              <img
                src={dentist.image}
                alt={dentist.name}
                className="card-img-top dentist-image"
              />

              <div className="card-body text-center">
                <h4 className="fw-bold">
                  {dentist.name}
                </h4>

                <p className="text-primary fw-semibold">
                  {dentist.specialty}
                </p>

                <p className="text-muted">
                  {dentist.description}
                </p>

                <button className="btn custom-btn text-white">
                  Ver Perfil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dentists