# Community Care Connect - Scenario 1 Implementation

## Overview

This portal implements **Gravity Project SDOH Connectathon Scenario 1: Individual (FHIR Patient) Self-Referral**.

The application enables patients to:
1. Search for social services (food, housing, mental health, transportation, parenting)
2. Request referrals through a self-service web portal
3. Complete an AHC HRSN (Accountable Health Communities Health-Related Social Needs) screening
4. Have their referral data automatically submitted to the Coordination Platform Server via FHIR

## Scenario 1 Workflow

Based on the Gravity Connectathon workflow diagram, this implementation covers:

### Steps 1-4: Patient Self-Service (Web Portal)
- **Step 1**: Patient initiates web search for housing assistance services
- **Step 2**: Patient finds self-referral web questionnaire with screening questions
- **Step 3**: Web portal suggests services and contact information
- **Step 4**: CBO emails or calls patient to begin engagement

### Steps 5-9: FHIR Integration (Automated)
When a patient submits a referral request, the portal automatically:

- **Step 5**: Creates a `TaskForPatient` resource requesting AHC HRSN assessment
  - Resource: `Task` with profile `SDOHCC-TaskForPatient`
  - Status: `ready`
  - Code: `complete-questionnaire`

- **Step 6**: Submits a `QuestionnaireResponse` with completed AHC HRSN assessment
  - Resource: `QuestionnaireResponse`
  - Contains patient contact info and screening answers
  - Questions cover: food insecurity, housing stability, transportation access

- **Step 7**: Updates the Task to `completed` status with PATCH operation
  - Adds QuestionnaireResponse reference to Task output
  - Marks assessment workflow complete

- **Step 8**: (Future) CBO documents housing assistance with `Procedure` resource

- **Step 9**: Verification - all resources can be retrieved via `Patient/$everything`

## Patient Modes

The portal supports two modes for Scenario 1:

### 1. Create New Patient (Real Self-Referral) — **Default**
- **Use Case**: Realistic scenario where unknown individuals self-refer
- **Behavior**: Each referral creates a NEW Patient resource from the form data
- **Patient Data Source**: First name, last name, DOB, phone, email, ZIP code from the referral form
- **FHIR Resources Created**: Patient → Task → QuestionnaireResponse
- **Best For**: Production use, real community members seeking services

### 2. Use Test Patient (Connectathon Testing)
- **Use Case**: Connectathon testing with pre-seeded patients
- **Behavior**: All referrals use the same pre-configured test patient (e.g., Grover Cleveland)
- **Patient Data Source**: Pre-seeded via Scenario 0 Postman requests
- **FHIR Resources Created**: Task → QuestionnaireResponse (Patient already exists)
- **Best For**: Testing with known patient IDs, comparing with other RI implementations

**Switch modes** in the ⚙️ FHIR Config panel.

## FHIR Resources Created

### 1. Patient (when in "Create New Patient" mode)
```json
{
  "resourceType": "Patient",
  "meta": {
    "profile": ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient"]
  },
  "identifier": [{
    "system": "http://community-care-connect.example.org/patient-id",
    "value": "CCC-AB12-3456"
  }],
  "active": true,
  "name": [{
    "use": "official",
    "family": "Smith",
    "given": ["Jane"]
  }],
  "telecom": [
    {"system": "phone", "value": "555-123-4567", "use": "mobile"},
    {"system": "email", "value": "jane@example.com", "use": "home"}
  ],
  "birthDate": "1985-03-15",
  "address": [{
    "use": "home",
    "postalCode": "14608",
    "country": "US"
  }]
}
```

### 2. Task (TaskForPatient)
```json
{
  "resourceType": "Task",
  "meta": {
    "profile": ["http://hl7.org/fhir/us/sdoh-clinicalcare/StructureDefinition/SDOHCC-TaskForPatient"]
  },
  "intent": "order",
  "status": "ready" → "completed",
  "code": {
    "coding": [{
      "system": "http://hl7.org/fhir/uv/sdc/CodeSystem/temp",
      "code": "complete-questionnaire"
    }]
  },
  "for": { "reference": "Patient/{patientId}" },
  "requester": { "reference": "Organization/{orgId}" },
  "owner": { "reference": "Patient/{patientId}" }
}
```

### 3. QuestionnaireResponse
```json
{
  "resourceType": "QuestionnaireResponse",
  "questionnaire": "http://example.org/fhir/Questionnaire/AHC-HRSN",
  "status": "completed",
  "subject": { "reference": "Patient/{patientId}" },
  "item": [
    {
      "linkId": "food-insecurity",
      "text": "In the past 12 months, did you worry that your food would run out...",
      "answer": [{ "valueString": "yes|no|prefer-not" }]
    },
    {
      "linkId": "housing-stability",
      "text": "Do you have housing that is stable and safe?",
      "answer": [{ "valueString": "yes|no|prefer-not" }]
    },
    {
      "linkId": "transportation-access",
      "text": "Do you have difficulty getting transportation...",
      "answer": [{ "valueString": "yes|no|prefer-not" }]
    }
  ]
}
```

## Configuration

Click the **⚙️ FHIR Config** button in the header to configure:

### Required Settings
- **CP Server Base URL**: `https://sdoh-cp-server.victoriousbay-86ce63e0.southcentralus.azurecontainerapps.io/fhir`
- **Organization ID**: `SDOHCC-OrganizationCoordinationPlatformExample`

### Patient Mode (choose one)

#### Create New Patient (Default) ✅ Recommended for Real Use
- Each referral creates a unique Patient resource
- Patient information comes from the referral form
- **No pre-seeding required**
- Best for: Production use, real community members

#### Use Test Patient (Connectathon Testing Only)
- All referrals use the same pre-configured patient
- Requires patient to be seeded via Scenario 0 Postman requests
- Configure Test Patient ID and Display Name
- Best for: Testing, comparing with other RI implementations

**Configuration is saved to browser localStorage for persistence.**

### Available Test Patients (for "Use Test Patient" mode only)

When using test patient mode, first seed patients using Scenario 0 Postman requests, then select from:

1. **Rebecca Smith** (`gravity-patient-rebecca-smith`)
   - Female, DOB: 1988-04-12, Rochester, NY 14608

2. **Grover Cleveland** (`gravity-patient-grover-cleveland`) ← Default Test Patient
   - Male, DOB: 1837-03-18, Buffalo, NY 14202

3. **Maria Torres** (`gravity-patient-maria-torres`)
   - Female, DOB: 1979-09-22, Syracuse, NY 13204

4. **James Okafor** (`gravity-patient-james-okafor`)
   - Male, DOB: 1966-11-03, Albany, NY 12207

## Testing the Workflow

### Prerequisites
- Ensure CP Server is accessible
- (Optional) If using "Test Patient" mode, seed patient using Scenario 0 Postman requests

### Test Steps - Create New Patient Mode (Default)
1. Open the portal: [https://community-care-connect.onrender.com](https://community-care-connect.onrender.com)
2. *(Optional)* Click **⚙️ FHIR Config** to verify mode is set to "Create New Patient"
3. Browse or search for a service (e.g., "Housing Support")
4. Click **Request referral** on any service card
5. Fill out the referral form with **new, unique information**:
   - First name: `Sarah` (or any name)
   - Last name: `Johnson` (or any name)
   - ZIP code: `14608` (required)
   - Date of birth: `1990-05-15` (optional but recommended)
   - Phone: `555-111-2222` (optional)
   - Email: `sarah.johnson@example.com` (optional)
   - Preferred contact method: Select one (required)
   - Answer the 3 HRSN screening questions
6. Click **Submit referral request**
7. The portal will:
   - Show "Submitting to FHIR server..." message
   - **Create new Patient** resource with form data
   - Create Task requesting AHC HRSN assessment
   - Create QuestionnaireResponse with screening answers
   - Update Task to completed status
   - Display success confirmation with Patient ID, Task ID, and QuestionnaireResponse ID

### Test Steps - Test Patient Mode (Connectathon Only)
1. Seed a test patient using Postman Scenario 0 (e.g., Grover Cleveland)
2. Open the portal and click **⚙️ FHIR Config**
3. Set Patient Mode to "Use Test Patient"
4. Enter Test Patient ID: `gravity-patient-grover-cleveland`
5. Enter Test Patient Display Name: `Grover Cleveland`
6. Save configuration
7. Follow steps 3-7 from "Create New Patient Mode" above
   - Note: The patient information from the form will be captured in QuestionnaireResponse but won't create a new Patient

### Verification

**Browser Console Logs:**
```
Creating new Patient... {resourceType: "Patient", ...}
Patient created: {resourceType: "Patient", id: "ccc-patient-...", ...}
Creating Task... {resourceType: "Task", ...}
Task created: {resourceType: "Task", id: "ccc-task-ahc-hrsn-...", ...}
Creating QuestionnaireResponse... {resourceType: "QuestionnaireResponse", ...}
QuestionnaireResponse created: {resourceType: "QuestionnaireResponse", ...}
Completing Task...
Task completed: {resourceType: "Task", status: "completed", ...}
```

**Postman Verification:**
```http
GET {{cp_base}}/Patient/ccc-patient-1779381617983-abc123/$everything?_format=json
```

This will return a Bundle containing:
- 1 Patient resource
- 1 Task resource (status: completed)
- 1 QuestionnaireResponse resource

## CORS Considerations

The CP Server must have CORS enabled to allow browser-based FHIR submissions. If you encounter CORS errors:

1. Check browser console for CORS-related error messages
2. Verify the CP Server allows requests from your domain
3. Consider using a CORS proxy for development/testing

## Alignment with Postman Collection

This implementation matches the Gravity SDOH Connectathon Postman Collection structure:

- **Scenario 0**: Manual patient seeding (done via Postman or Referral Source Client)
- **Scenario 1**: Self-referral flow (implemented in this portal)
  - `PUT /Task/{id}` - Create TaskForPatient
  - `PUT /QuestionnaireResponse/{id}` - Submit completed assessment
  - `PATCH /Task/{id}` - Mark task as completed
  - `GET /Patient/{id}/$everything` - Verify resources

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Community Care Connect (Static Web Portal)             │
│  - Service Directory                                    │
│  - Self-Referral Form                                   │
│  - AHC HRSN Screening Questions                         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ FHIR R4 API
                       │ (PUT Task, PUT QR, PATCH Task)
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  Coordination Platform Server (HAPI FHIR)               │
│  - Stores Patient, Task, QuestionnaireResponse          │
│  - Manages SDOH referral workflows                      │
│  - Coordinates between EHR, CBO, and other systems      │
└─────────────────────────────────────────────────────────┘
```

## Future Enhancements

### Scenario 1 Step 8: Procedure Documentation
Add ability for CBOs to document completed services:

```javascript
const procedure = {
  resourceType: "Procedure",
  status: "completed",
  category: {
    coding: [{
      system: "http://snomed.info/sct",
      code: "410606002",
      display: "Social service procedure"
    }]
  },
  code: {
    coding: [{
      system: "http://snomed.info/sct",
      code: "225340009",
      display: "Housing assessment"
    }]
  },
  subject: {
    reference: `Patient/${patientId}`
  },
  performedDateTime: "2026-05-21"
};
```

### Additional Features
- Real-time Task status updates
- CBO service provider dashboard
- Patient portal to view referral status
- Integration with Scenario 2 (Referral for Further Assessment)
- Integration with Scenario 4 (Direct Referral)

## Support

For questions about:
- **Gravity Project**: [https://thegravityproject.net](https://thegravityproject.net)
- **SDOH Clinical Care IG**: [http://hl7.org/fhir/us/sdoh-clinicalcare/](http://hl7.org/fhir/us/sdoh-clinicalcare/)
- **This implementation**: Contact Lantana Consulting Group

## License

Part of the Gravity Project SDOH Connectathon reference implementations.
