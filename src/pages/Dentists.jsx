function Dentists() {
  const dentists = [
    {
      id: 1,
      name: 'Dra. Laura Gómez',
      specialty: 'Ortodoncia',
      experience: '8 años de experiencia',
      image:
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2'
    },
    {
      id: 2,
      name: 'Dr. Carlos Ramírez',
      specialty: 'Cirugía Oral',
      experience: '12 años de experiencia',
      image:
        'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d'
    },
    {
      id: 3,
      name: 'Dra. Sofía Martínez',
      specialty: 'Odontología Estética',
      experience: '6 años de experiencia',
      image:
        'https://images.unsplash.com/photo-1594824476967-48c8b964273f'
    }
  ]

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1>Nuestros Odontólogos</h1>

        <p className="lead">
          Profesionales comprometidos con tu salud oral.
        </p>
      </div>

      <div className="row">
        {dentists.map((dentist) => (
          <div className="col-md-4 mb-4" key={dentist.id}>
            <div className="card shadow h-100">
              <img
                src={dentist.image}
                className="card-img-top"
                alt={dentist.name}
                style={{
                  height: '300px',
                  objectFit: 'cover'
                }}
              />

              <div className="card-body text-center">
                <h4>{dentist.name}</h4>

                <h6 className="text-primary">
                  {dentist.specialty}
                </h6>

                <p>{dentist.experience}</p>

                <button className="btn btn-outline-primary">
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