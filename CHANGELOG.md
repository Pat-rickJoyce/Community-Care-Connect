# Changelog

## [2.0.0] - 2026-05-21

### Added - Scenario 1 FHIR Integration

#### Major Features
- **Complete FHIR R4 integration** with Gravity SDOH Coordination Platform Server
- **Dual patient modes**:
  - **Create New Patient (Default)**: Creates Patient resource from referral form data (realistic self-referral)
  - **Use Test Patient**: Uses pre-seeded test patients for Connectathon testing
- **Automatic FHIR workflow** on referral submission:
  1. Creates Patient resource (in create mode)
  2. Creates TaskForPatient requesting AHC HRSN assessment
  3. Creates QuestionnaireResponse with screening answers
  4. Completes Task with PATCH operation
- **Configuration panel** (⚙️ FHIR Config button) for:
  - CP Server endpoint
  - Patient mode selection
  - Test patient configuration
  - Persistent storage via localStorage

#### FHIR Resources
- **Patient**: Created from form data (first name, last name, DOB, phone, email, ZIP)
- **Task**: SDOHCC-TaskForPatient profile, requesting AHC HRSN questionnaire completion
- **QuestionnaireResponse**: Captures contact info and 3 HRSN screening questions:
  - Food insecurity (past 12 months)
  - Housing stability
  - Transportation access
- All resources conform to:
  - US Core Patient profile
  - SDOH Clinical Care IG STU 2.1
  - SDC Questionnaire Response profile

#### User Experience
- Real-time submission status ("Submitting to FHIR server...")
- Success confirmation displays FHIR resource IDs
- Detailed console logging for debugging
- Error handling with user-friendly messages

#### Developer Experience
- Clean FHIR client abstraction (`createFHIRResource`, `patchFHIRResource`)
- Modular configuration system
- Comprehensive inline documentation
- Support for both production and testing workflows

### Documentation
- `SCENARIO1_README.md`: Complete Scenario 1 implementation guide
- `DEPLOYMENT.md`: Render deployment instructions
- `CHANGELOG.md`: This file

### Technical Details
- Static HTML/JavaScript implementation (no build process)
- Browser-based FHIR API calls (requires CORS)
- ID generation: timestamp + random string for uniqueness
- localStorage for configuration persistence

## [1.0.0] - 2026-05-20

### Initial Release
- Static service directory portal
- Category-based filtering (Food, Housing, Mental Health, Transportation, Parenting)
- Search functionality
- Referral request form with HRSN screening
- 25 community services in Bumblefield County
- Deployed on Render static hosting
