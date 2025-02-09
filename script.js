const API_URL = "https://67a3753b31d0d3a6b7839b58.mockapi.io/api/v1/appointments";

document.addEventListener("DOMContentLoaded", () => {
    const appointmentTime = document.getElementById("appointment-time");
    const dayButtons = document.querySelectorAll(".day-button");
    const generateIdForm = document.getElementById("generate-id-form");
    const generatedInfoSection = document.getElementById("generated-info-section");
    const generatedName = document.getElementById("generated-name");
    const generatedId = document.getElementById("generated-id");
    const generatedLink = document.getElementById("generated-link");
    const appointmentsList = document.getElementById("appointments-list");
    const appointmentsUl = document.getElementById("appointments");
    let selectedDay = null;

    const workHours = {
        segunda: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
        terça: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
        quarta: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
        quinta: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
        sexta: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
        sábado: ["08:00", "09:00", "10:00", "11:00", "12:00"],
    };

    dayButtons.forEach(button => {
        button.addEventListener("click", () => {
            dayButtons.forEach(btn => btn.classList.remove("selected"));
            button.classList.add("selected");
            selectedDay = button.dataset.day;
            appointmentTime.innerHTML = '<option value="" disabled selected>Selecione um horário</option>';
            workHours[selectedDay].forEach(time => {
                const option = document.createElement("option");
                option.value = time;
                option.textContent = time;
                appointmentTime.appendChild(option);
            });
        });
    });

    generateIdForm.addEventListener("submit", async e => {
        e.preventDefault();
        const clientName = document.getElementById("client-name").value;
        const appointmentTimeValue = appointmentTime.value;
        if (!selectedDay || !appointmentTimeValue) {
            alert("Por favor, selecione um dia e um horário válidos.");
            return;
        }
        const appointment = { name: clientName, day: selectedDay, time: appointmentTimeValue, status: "Não Confirmado" };
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(appointment),
        });
        const newAppointment = await response.json();
        generatedName.textContent = newAppointment.name;
        generatedId.textContent = newAppointment.id;
        generatedLink.href = `confirm.html?id=${newAppointment.id}`;
        generatedLink.textContent = `Clique aqui para confirmar o agendamento`;
        generatedInfoSection.style.display = "block";
    });

    document.getElementById("view-appointments").addEventListener("click", async () => {
        const response = await fetch(API_URL);
        const appointments = await response.json();
        appointmentsUl.innerHTML = "";
        appointments.forEach(app => {
            const li = document.createElement("li");
            li.innerHTML = `${app.name} - ${app.day} às ${app.time} (Status: ${app.status}) <a href='confirm.html?id=${app.id}'>Confirmar</a> <button onclick='deleteAppointment(${app.id})'>Desmarcar</button>`;
            appointmentsUl.appendChild(li);
        });
        appointmentsList.style.display = "block";
    });

    window.deleteAppointment = async (id) => {
        if (confirm("Tem certeza que deseja desmarcar este agendamento?")) {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            alert("Agendamento desmarcado.");
            document.getElementById("view-appointments").click();
        }
    };

    document.getElementById("clear-appointments").addEventListener("click", async () => {
        if (confirm("Tem certeza que deseja excluir todos os agendamentos?")) {
            const response = await fetch(API_URL);
            const appointments = await response.json();
            for (let app of appointments) {
                await fetch(`${API_URL}/${app.id}`, { method: "DELETE" });
            }
            alert("Todos os agendamentos foram excluídos.");
        }
    });
});
