const services = [
  {
    name: "Mimi's Pantry",
    category: "food",
    description: "Food pantry support for households experiencing food insecurity in the Clay County area.",
    phone: "(816) 555-0101",
    address: "Clay County, MO"
  },
  {
    name: "Turning Point",
    category: "food",
    description: "Community resource support, including connections to food assistance and household stability services.",
    phone: "(816) 555-0102",
    address: "Kansas City Northland area"
  },
  {
    name: "Harvester",
    category: "food",
    description: "Regional food bank network connecting families to pantry locations and nutrition assistance.",
    phone: "(816) 929-3000",
    address: "Regional service network"
  },
  {
    name: "Local Food Pantries and Churches",
    category: "food",
    description: "Multiple local pantries and church-based food ministries offer emergency groceries and referrals.",
    phone: "(816) 555-0103",
    address: "Various Missouri 7th Judicial Circuit locations"
  },
  {
    name: "HUD Housing Authority",
    category: "housing",
    description: "Public housing and affordable housing information for residents seeking stable housing support.",
    phone: "(816) 555-0201",
    address: "Clay County, MO"
  },
  {
    name: "Section 8 Housing Choice Voucher Support",
    category: "housing",
    description: "Voucher program navigation and referrals for eligible households needing rental assistance.",
    phone: "(816) 555-0202",
    address: "Regional housing offices"
  },
  {
    name: "Transitional Living",
    category: "housing",
    description: "Short-term housing and stabilization support for people moving toward permanent housing.",
    phone: "(816) 555-0203",
    address: "Community-based housing providers"
  },
  {
    name: "Beacon Mental Health",
    category: "mental-health",
    description: "School-based services, crisis therapy, and community-based behavioral health support.",
    phone: "(816) 468-0400",
    address: "Kansas City Northland area"
  },
  {
    name: "Synergy Services",
    category: "mental-health",
    description: "Crisis services, teen support, youth shelter, and family stabilization services.",
    phone: "(816) 587-4100",
    address: "400 E 6th St, Parkville, MO"
  },
  {
    name: "Preferred Family Healthcare",
    category: "mental-health",
    description: "Behavioral health, substance use, and community support services for individuals and families.",
    phone: "(816) 555-0301",
    address: "Regional service locations"
  },
  {
    name: "988 Crisis Line",
    category: "mental-health",
    description: "Immediate mental health crisis support available by calling or texting 988.",
    phone: "988",
    address: "Available 24/7"
  },
  {
    name: "Mobile Crisis Response Team",
    category: "mental-health",
    description: "Mobile response for behavioral health crises when in-person stabilization support may be needed.",
    phone: "(816) 555-0302",
    address: "Regional crisis response"
  },
  {
    name: "ATA Bus",
    category: "transportation",
    description: "Public bus service for appointments, work, school, shopping, and community services.",
    phone: "(816) 221-0660",
    address: "Kansas City regional routes"
  },
  {
    name: "Medicaid Transportation",
    category: "transportation",
    description: "Non-emergency medical transportation for eligible Medicaid members.",
    phone: "(866) 269-5927",
    address: "Statewide transportation benefit"
  },
  {
    name: "Excelsior Springs Bus System",
    category: "transportation",
    description: "Local transportation option for residents traveling within the Excelsior Springs area.",
    phone: "(816) 555-0401",
    address: "Excelsior Springs, MO"
  },
  {
    name: "Lyft and Uber",
    category: "transportation",
    description: "Ride-share options that may help with time-sensitive trips when public transit is unavailable.",
    phone: "Use mobile app",
    address: "Available by service area"
  },
  {
    name: "IRIS",
    category: "transportation",
    description: "On-demand transit option for flexible local transportation needs.",
    phone: "(816) 205-8221",
    address: "Kansas City regional service"
  }
];

const categoryLabels = {
  food: "Food",
  housing: "Housing",
  transportation: "Transportation",
  "mental-health": "Mental Health"
};

const serviceGrid = document.querySelector("#serviceGrid");
const resultCount = document.querySelector("#resultCount");
const filterButtons = document.querySelectorAll(".filter-button");
const modal = document.querySelector("#referralModal");
const closeModal = document.querySelector("#closeModal");
const doneButton = document.querySelector("#doneButton");
const referralForm = document.querySelector("#referralForm");
const formPanel = document.querySelector("#formPanel");
const confirmationPanel = document.querySelector("#confirmationPanel");
const selectedService = document.querySelector("#selectedService");
const serviceNameInput = document.querySelector("#serviceName");

let activeFilter = "all";

function renderServices() {
  const filteredServices = activeFilter === "all"
    ? services
    : services.filter((service) => service.category === activeFilter);

  resultCount.textContent = `${filteredServices.length} service${filteredServices.length === 1 ? "" : "s"} shown`;
  serviceGrid.innerHTML = "";

  filteredServices.forEach((service) => {
    const phoneDigits = service.phone.replace(/[^\d+]/g, "");
    const contactMarkup = phoneDigits
      ? `<a class="phone" href="tel:${phoneDigits}">${service.phone}</a>`
      : `<span class="phone">${service.phone}</span>`;

    const card = document.createElement("article");
    card.className = "service-card";
    card.innerHTML = `
      <span class="tag">${categoryLabels[service.category]}</span>
      <h3>${service.name}</h3>
      <p>${service.description}</p>
      ${contactMarkup}
      <address>${service.address}</address>
      <button class="button primary" type="button">Start self-referral</button>
    `;

    card.querySelector("button").addEventListener("click", () => openReferral(service.name));
    serviceGrid.appendChild(card);
  });
}

function openReferral(serviceName) {
  selectedService.textContent = `Selected service: ${serviceName}`;
  serviceNameInput.value = serviceName;
  formPanel.hidden = false;
  confirmationPanel.hidden = true;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  document.querySelector("#firstName").focus();
}

function closeReferral() {
  modal.hidden = true;
  document.body.style.overflow = "";
  referralForm.reset();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => filterButton.classList.remove("active"));
    button.classList.add("active");
    renderServices();
  });
});

closeModal.addEventListener("click", closeReferral);
doneButton.addEventListener("click", closeReferral);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeReferral();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) {
    closeReferral();
  }
});

referralForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formPanel.hidden = true;
  confirmationPanel.hidden = false;
  confirmationPanel.querySelector("button").focus();
});

renderServices();
