// 1. Database (Simulated)
const membersDB = [
    { id: 1001, name: "Saveen Kudagama", status: "Active", isCheckedIn: false, nextPaymentDate: "2026-02-15" }, // 11 days left
    { id: 1002, name: "Kasun Kalhara", status: "Active", isCheckedIn: false, nextPaymentDate: "2026-02-05" },  // 1 day left
    { id: 1003, name: "Nimal Siripala", status: "Expired", isCheckedIn: false, nextPaymentDate: "2026-01-30" }, // Expired
];

// 2. Attendance Logic
function handleEnter(e) {
    if (e.key === 'Enter') markAttendance();
}

function markAttendance() {
    const input = document.getElementById('member-id-input');
    if (!input) return;

    const id = parseInt(input.value);
    const member = membersDB.find(m => m.id === id);

    if (member) {
        // Calculate Days Remaining
        const today = new Date();
        const paymentDate = new Date(member.nextPaymentDate);
        const diffTime = paymentDate - today;
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (member.status === 'Expired' || daysRemaining < 0) {
            showToast(`Warning: Payment Overdue by ${Math.abs(daysRemaining)} days!`, "red");
            return;
        }

        let type = "Check In";

        // Toggle Status
        if (member.isCheckedIn) {
            // Check OUT
            type = "Check Out";
            member.isCheckedIn = false;
        } else {
            // Check IN
            type = "Check In";
            member.isCheckedIn = true;

            // Update Stats (Count Check-ins)
            const stat = document.getElementById('stat-checkins');
            if (stat) {
                stat.innerText = parseInt(stat.innerText) + 1;
            }
        }

        // Show Full Screen Greeting (if overlay exists - Kiosk Mode)
        if (document.getElementById('greeting-overlay')) {
            showGreeting(member, type, daysRemaining);
        } else {
            // Admin Mode Fallback
            const color = type === "Check In" ? "green" : "orange";
            // Custom Message based on days remaining for toast
            if (type === "Check In" && daysRemaining <= 5) {
                showToast(`Welcome! Payment due in ${daysRemaining} days.`, "#F59E0B");
            } else {
                showToast(`${type}: ${member.name}`, color);
            }
        }

        addLogEntry(member.name, id, type, daysRemaining);

        input.value = ""; // Clear input
    } else {
        showToast("Error: Member ID not found!", "#ef4444"); // Red
        input.classList.add('border-red-500');
        setTimeout(() => input.classList.remove('border-red-500'), 2000);
    }
}

function addLogEntry(name, id, type, daysRemaining) {
    const tbody = document.getElementById('attendance-log-body');
    if (!tbody) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isCheckIn = type === "Check In";

    // Dark Theme Colors
    const statusColor = isCheckIn ? "text-green-400 bg-green-900/30" : "text-orange-400 bg-orange-900/30";
    const rowBg = isCheckIn ? "bg-white/10" : "bg-white/5";

    // Payment Badge Logic (Dark Theme)
    let paymentBadge = "";
    if (isCheckIn) {
        if (daysRemaining <= 3) {
            paymentBadge = `<span class="ml-2 text-xs font-bold text-red-400 bg-red-900/30 px-2 py-0.5 rounded border border-red-500/30">Due: ${daysRemaining} days</span>`;
        } else if (daysRemaining <= 7) {
            paymentBadge = `<span class="ml-2 text-xs font-bold text-yellow-400 bg-yellow-900/30 px-2 py-0.5 rounded border border-yellow-500/30">Due: ${daysRemaining} days</span>`;
        } else {
            paymentBadge = `<span class="ml-2 text-xs font-bold text-gray-400 bg-gray-700/30 px-2 py-0.5 rounded border border-gray-600/30">${daysRemaining} days left</span>`;
        }
    }

    const row = `
        <tr class="border-b border-white/5 ${rowBg} animate-pulse">
            <td class="px-5 py-4 md:px-8 md:py-5 flex items-center">
                <div class="h-10 w-10 md:h-12 md:w-12 rounded-full bg-brand text-gray-900 flex items-center justify-center font-bold mr-3 md:mr-4 text-sm md:text-lg">
                    ${name.charAt(0)}
                </div>
                <div>
                    <p class="font-bold text-gray-200 text-base md:text-lg">${name} ${paymentBadge}</p>
                    <p class="text-xs md:text-sm text-gray-400">ID: ${id}</p>
                </div>
            </td>
            <td class="px-5 py-4 md:px-8 md:py-5 text-right">
                <p class="text-gray-300 font-mono text-sm md:text-lg">${time}</p>
                <span class="text-xs font-bold px-2 py-1 rounded ${statusColor}">${type}</span>
            </td>
        </tr>
    `;

    // Add new row to top
    tbody.insertAdjacentHTML('afterbegin', row);
}

// Toast Notification Helper
function showToast(msg, color) {
    Toastify({
        text: msg,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: { background: color === 'green' ? "#10B981" : color },
        stopOnFocus: true,
    }).showToast();
}

// 3. Experience Logic (Greeting Overlay)
function showGreeting(member, type, daysRemaining) {
    const overlay = document.getElementById('greeting-overlay');
    const content = document.getElementById('greeting-content');

    // 1. Update Content
    document.getElementById('greeting-name').innerText = member.name;
    document.getElementById('greeting-avatar').innerText = member.name.charAt(0);

    // Greeting based on time
    const hour = new Date().getHours();
    let greeting = "Welcome,";
    if (type === "Check Out") greeting = "Goodbye,";
    else if (hour < 12) greeting = "Good Morning,";
    else if (hour < 18) greeting = "Good Afternoon,";
    else greeting = "Good Evening,";

    document.getElementById('greeting-time').innerText = greeting;

    // Status Badge
    const statusDiv = document.getElementById('greeting-status');
    if (type === 'Check In') {
        statusDiv.className = "inline-flex items-center px-8 py-3 rounded-full text-2xl font-bold bg-green-500/20 text-green-400 border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)] mb-8 backdrop-blur-sm";
        statusDiv.innerHTML = `<i class="fas fa-check-circle mr-3"></i> <span>Check-In Successful</span>`;
    } else {
        statusDiv.className = "inline-flex items-center px-8 py-3 rounded-full text-2xl font-bold bg-orange-500/20 text-orange-400 border border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.3)] mb-8 backdrop-blur-sm";
        statusDiv.innerHTML = `<i class="fas fa-sign-out-alt mr-3"></i> <span>Check-Out Successful</span>`;
    }

    // Payment Info
    const msgDiv = document.getElementById('greeting-msg');
    if (daysRemaining <= 5) {
        msgDiv.innerHTML = `Payment is due in <span class="text-orange-500 font-bold text-3xl">${daysRemaining} days</span>. Please renew soon.`;
    } else {
        msgDiv.innerHTML = `Next payment date is in <span class="text-brand font-bold text-2xl">${daysRemaining} days</span>.`;
    }

    // 2. Show Overlay
    overlay.classList.remove('hidden', 'pointer-events-none');
    // Small delay to allow display:block to apply before opacity transition
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        content.classList.remove('scale-90');
        content.classList.add('scale-100');
    }, 10);

    // 3. Hide Overlay (Auto Dismiss)
    setTimeout(() => {
        overlay.classList.add('opacity-0');
        content.classList.remove('scale-100');
        content.classList.add('scale-90');

        setTimeout(() => {
            overlay.classList.add('hidden', 'pointer-events-none');
        }, 300); // Wait for transition to finish
    }, 2500); // Display time
}

// 4. Admin Panel Navigation
function switchSection(sectionId) {
    // 1. Update Title
    const titles = {
        'dashboard': 'Admin Dashboard',
        'members': 'Member Directory',
        'payments': 'Payments & Billing',
        'attendance': 'Attendance Records'
    };
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.innerText = titles[sectionId] || 'Admin Panel';

    // 2. Hide All Sections
    ['dashboard', 'members', 'payments', 'attendance'].forEach(id => {
        const el = document.getElementById(`section-${id}`);
        if (el) el.classList.add('hidden');

        const nav = document.getElementById(`nav-${id}`);
        if (nav) {
            // Reset nav style
            nav.className = "nav-item w-full flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer";
        }
    });

    // 3. Show Active Section
    const activeSection = document.getElementById(`section-${sectionId}`);
    if (activeSection) {
        activeSection.classList.remove('hidden');
        // Add animation
        activeSection.classList.add('animate-fade-in');
    }

    // 4. Highlight Nav
    const activeNav = document.getElementById(`nav-${sectionId}`);
    if (activeNav) {
        activeNav.className = "nav-item w-full flex items-center px-4 py-3 bg-brand text-white rounded-xl transition-all cursor-pointer shadow-lg shadow-purple-500/20 transform scale-105";
    }
}
