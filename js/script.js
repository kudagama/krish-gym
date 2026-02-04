// 1. Navigation Logic (Switching Tabs)
function showSection(sectionId) {
    // Hide all sections
    document.getElementById('section-dashboard').classList.add('hidden');
    document.getElementById('section-attendance').classList.add('hidden');
    
    // Reset Button Styles
    document.getElementById('nav-dashboard').classList.replace('bg-brand', 'text-gray-400');
    document.getElementById('nav-dashboard').classList.remove('text-white');
    document.getElementById('nav-attendance').classList.replace('bg-brand', 'text-gray-400');
    document.getElementById('nav-attendance').classList.remove('text-white');

    // Show selected section
    document.getElementById('section-' + sectionId).classList.remove('hidden');
    
    // Highlight active button
    const activeBtn = document.getElementById('nav-' + sectionId);
    activeBtn.classList.add('bg-brand', 'text-white');
    activeBtn.classList.remove('text-gray-400');

    // Change Title
    document.getElementById('page-title').innerText = sectionId === 'dashboard' ? 'Dashboard Overview' : 'Kiosk Mode';
}

// 2. Dummy Database (To Simulate Backend)
const membersDB = [
    { id: 1001, name: "Saveen Kudagama", status: "Active" },
    { id: 1002, name: "Kasun Kalhara", status: "Active" },
    { id: 1003, name: "Nimal Siripala", status: "Expired" },
];

// 3. Attendance Logic
function handleEnter(e) {
    if(e.key === 'Enter') markAttendance();
}

function markAttendance() {
    const input = document.getElementById('member-id-input');
    const id = parseInt(input.value);
    const member = membersDB.find(m => m.id === id);

    if (member) {
        if(member.status === 'Expired') {
            showToast(`Warning: Membership Expired for ${member.name}!`, "red");
            return;
        }

        // Success
        showToast(`Welcome back, ${member.name}!`, "green");
        addLogEntry(member.name, id);
        input.value = ""; // Clear input
        
        // Update stats
        const stat = document.getElementById('stat-checkins');
        stat.innerText = parseInt(stat.innerText) + 1;
    } else {
        showToast("Error: Member ID not found!", "#ef4444"); // Red
        input.classList.add('border-red-500');
        setTimeout(() => input.classList.remove('border-red-500'), 2000);
    }
}

function addLogEntry(name, id) {
    const tbody = document.getElementById('attendance-log-body');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const row = `
        <tr class="border-b border-gray-100 bg-purple-50 animate-pulse">
            <td class="px-6 py-4 flex items-center">
                <div class="h-10 w-10 rounded-full bg-brand text-white flex items-center justify-center font-bold mr-3">
                    ${name.charAt(0)}
                </div>
                <div>
                    <p class="font-bold text-gray-800">${name}</p>
                    <p class="text-xs text-gray-500">ID: ${id}</p>
                </div>
            </td>
            <td class="px-6 py-4 text-right">
                <p class="text-gray-800 font-mono">${time}</p>
                <span class="text-xs text-green-600 font-bold">Just Now</span>
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
