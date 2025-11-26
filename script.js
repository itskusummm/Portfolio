// --- JavaScript for Interactivity ---

document.getElementById('current-year').textContent = new Date().getFullYear();

// 1. Tab Switching Logic for Skills Section
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// Initial setup for tab styling
tabButtons.forEach(button => {
    // Neutral style
    button.classList.add('text-text-dark/70', 'bg-background-light', 'hover:bg-section-light');
});

// Active style (Pink background with dark text)
document.querySelector('.active-tab').classList.remove('text-text-dark/70', 'bg-background-light');
document.querySelector('.active-tab').classList.add('text-background-light', 'bg-primary-pink/90', 'shadow-md', 'shadow-primary-pink/30');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;

        // Hide all content
        tabContents.forEach(content => {
            content.classList.add('hidden');
        });

        // Show target content
        document.getElementById(targetTab).classList.remove('hidden');

        // Update button styles
        tabButtons.forEach(btn => {
            // Reset to neutral styles
            btn.classList.remove('active-tab', 'text-background-light', 'bg-primary-pink/90', 'shadow-md', 'shadow-primary-pink/30');
            btn.classList.add('text-text-dark/70', 'bg-background-light', 'hover:bg-section-light');
        });
        
        // Set active styles (using primary-pink)
        button.classList.add('active-tab', 'text-background-light', 'bg-primary-pink/90', 'shadow-md', 'shadow-primary-pink/30');
        button.classList.remove('text-text-dark/70', 'bg-background-light');
    });
});

// 2. Form Submission Logic
const formMessageDiv = document.getElementById('form-message');
const loadingIndicator = document.getElementById('loading-indicator');
const submitButton = document.getElementById('submit-btn');
const formSubjectHidden = document.getElementById('form-subject-hidden');

function setFormState(isLoading) {
    submitButton.disabled = isLoading;
    if (isLoading) {
        loadingIndicator.classList.remove('hidden');
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
    } else {
        loadingIndicator.classList.add('hidden');
        submitButton.innerHTML = '<i class="fas fa-paper-plane mr-2"></i> Send Message';
    }
}

function showFormMessage(type, message) {
    formMessageDiv.textContent = message;
    // Reset classes
    formMessageDiv.classList.remove('hidden', 'bg-red-300/30', 'text-red-900', 'border-red-500', 'bg-primary-pink/30', 'text-text-dark', 'border', 'border-primary-pink');
    
    if (type === 'success') {
        formMessageDiv.classList.add('bg-primary-pink/30', 'text-text-dark', 'border', 'border-primary-pink');
    } else if (type === 'error') {
        formMessageDiv.classList.add('bg-red-300/30', 'text-red-900', 'border', 'border-red-500');
    }

    // Auto-hide message after 5 seconds
    setTimeout(() => {
        formMessageDiv.classList.add('hidden');
    }, 5000);
}

// Attach the submitContactForm function to the form in index.html
// Note: The form's onsubmit attribute calls this function globally.

async function submitContactForm(event) {
    event.preventDefault(); 
    const form = event.target;
    const formData = new FormData(form);
    
    // Extract name for a better subject line
    const name = formData.get('name') || 'Someone';
    formSubjectHidden.value = `New Portfolio Message from ${name}`;
    
    setFormState(true);

    try {
        // FormSubmit works by accepting a POST request with form data
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            // Request JSON response for better client-side handling
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            // Success is assumed based on the API response
            showFormMessage('success', 'Message sent successfully! I will get back to you within 24 hours.');
            form.reset();
        } else {
            const data = await response.json();
            showFormMessage('error', `Submission failed. ${data.message || 'Please ensure all fields are filled correctly.'}`);
        }
    } catch (error) {
        console.error('Network Error:', error);
        showFormMessage('error', 'A network error occurred. Please check your connection.');
    } finally {
        setFormState(false);
    }
}

// 3. Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

document.getElementById('mobile-menu-button').addEventListener('click', toggleMobileMenu);

// Globally attach submitContactForm to the form for the onsubmit handler in index.html
window.submitContactForm = submitContactForm;