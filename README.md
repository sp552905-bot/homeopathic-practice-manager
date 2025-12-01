# Homeopathic Practice Manager

A comprehensive practice management system for homeopathic physicians, similar to Synthesis, Zomeo, and Radar Opus software.

## Features

### 🏥 Patient Management
- Complete patient records with demographics and medical history
- Patient search and filtering
- Consultation history tracking
- Follow-up management

### 💊 Materia Medica
- Comprehensive remedy database
- Detailed remedy information including:
  - Mental and physical symptoms
  - Modalities
  - Characteristics
  - Relationships
  - Dosage information

### 📚 Repertorization Engine
- Symptom-based remedy selection
- Multi-symptom analysis
- Graded symptom matching (1-3 intensity levels)
- Coverage percentage calculation
- Intelligent remedy scoring

### 📝 Consultation Management
- Structured case taking forms
- Chief complaint documentation
- Present illness history
- Past and family history
- Physical examination notes
- Mental symptoms tracking
- Modalities recording

### 💉 Prescription Management
- Create and track prescriptions
- Potency and dosage management
- Frequency and duration tracking
- Prescription history per patient
- Instructions and notes

### 📊 Follow-up System
- Track patient progress
- Record remedy responses
- Document improvements
- Note new symptoms
- Follow-up scheduling

## Technology Stack

- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Frontend**: HTML5, Bootstrap 5, Vanilla JavaScript
- **Authentication**: JWT tokens
- **Security**: bcrypt password hashing

## Installation

### Prerequisites
- Node.js 18+ installed
- Supabase account

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/sp552905-bot/homeopathic-practice-manager.git
cd homeopathic-practice-manager
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Supabase**
   - Create a new Supabase project
   - Run the SQL schema from `database/schema.sql` in Supabase SQL Editor
   - Optionally run `database/seed_remedies.sql` for sample remedy data

4. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Update with your Supabase credentials:
```env
PORT=3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_secure_random_string
NODE_ENV=development
```

5. **Start the application**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

6. **Access the application**
   - Open browser to `http://localhost:3000`
   - Register as a new physician
   - Start managing your practice!

## Database Schema

### Core Tables
- **physicians**: Physician accounts and credentials
- **patients**: Patient demographics and medical history
- **remedies**: Homeopathic remedies (Materia Medica)
- **repertory_sections**: Repertory organization
- **repertory_symptoms**: Symptom database
- **remedy_symptoms**: Remedy-symptom relationships with grades
- **consultations**: Patient consultation records
- **prescriptions**: Prescription management
- **followups**: Follow-up visit tracking

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new physician
- `POST /api/auth/login` - Physician login

### Patients
- `GET /api/patients` - List all patients
- `POST /api/patients` - Create new patient
- `GET /api/patients/:id` - Get patient details
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/search/:query` - Search patients

### Remedies
- `GET /api/remedies` - List all remedies
- `GET /api/remedies/:id` - Get remedy details
- `GET /api/remedies/search/:query` - Search remedies
- `POST /api/remedies/by-symptoms` - Find remedies by symptoms

### Repertory
- `GET /api/repertory/sections` - List repertory sections
- `GET /api/repertory/sections/:id/symptoms` - Get symptoms by section
- `GET /api/repertory/symptoms/search/:query` - Search symptoms
- `POST /api/repertory/analyze` - Repertorization analysis

### Prescriptions
- `POST /api/prescriptions` - Create prescription
- `GET /api/prescriptions/patient/:id` - Get patient prescriptions
- `GET /api/prescriptions/:id` - Get prescription details
- `PUT /api/prescriptions/:id` - Update prescription

### Consultations
- `POST /api/consultations` - Create consultation
- `GET /api/consultations/patient/:id` - Get patient consultations
- `GET /api/consultations/:id` - Get consultation details
- `PUT /api/consultations/:id` - Update consultation
- `POST /api/consultations/:id/followup` - Add follow-up
- `GET /api/consultations/:id/followups` - Get follow-ups

## Usage Guide

### Adding Patients
1. Navigate to Patients section
2. Click "Add Patient"
3. Fill in patient details
4. Save patient record

### Creating Consultations
1. Select patient from list
2. Click consultation icon
3. Document case details:
   - Chief complaint
   - Present illness
   - Medical history
   - Physical examination
   - Mental symptoms
   - Modalities

### Repertorization
1. Go to Repertory section
2. Search and select symptoms
3. Click "Analyze & Find Remedies"
4. Review suggested remedies with scores
5. Select appropriate remedy

### Prescribing
1. After repertorization or consultation
2. Select remedy
3. Specify:
   - Potency (e.g., 30C, 200C, 1M)
   - Dosage (e.g., 4 pills)
   - Frequency (e.g., twice daily)
   - Duration (e.g., 7 days)
4. Add instructions
5. Save prescription

### Follow-ups
1. Open patient consultation
2. Add follow-up notes
3. Document:
   - Improvement level
   - New symptoms
   - Remedy response
4. Adjust prescription if needed

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- User-specific data isolation
- SQL injection prevention

## Deployment

### Deploy to Railway
1. Push code to GitHub
2. Connect Railway to repository
3. Add environment variables
4. Deploy automatically

### Deploy to Heroku
```bash
heroku create your-app-name
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_KEY=your_key
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## License

MIT License - feel free to use for your practice!

## Support

For issues or questions:
- Open GitHub issue
- Email: support@example.com

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced repertorization algorithms
- [ ] Prescription printing
- [ ] Appointment scheduling
- [ ] Billing and invoicing
- [ ] Multi-language support
- [ ] Cloud backup
- [ ] Analytics dashboard
- [ ] Integration with pharmacy systems

## Acknowledgments

Inspired by professional homeopathic software:
- Synthesis Repertory
- Zomeo Homeopathic Software
- Radar Opus

Built with ❤️ for the homeopathic community
