const API_URL = "https://67a3753b31d0d3a6b7839b58.mockapi.io/api/v1/appointments";

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const confirmationInfo = document.getElementById("confirmation-info");
    const confirmationActions = document.getElementById("confirmation-actions");
    
    if (!id) {
        confirmationInfo.innerHTML = "<p style='color: red; text-align: center; font-size: 18px;'>ID inválido ou não encontrado.</p>";
        return;
    }

    const response = await fetch(`${API_URL}/${id}`);
    const appointment = await response.json();

    if (!appointment || !appointment.id) {
        confirmationInfo.innerHTML = "<p style='color: red; text-align: center; font-size: 18px;'>Agendamento não encontrado.</p>";
        return;
    }

    confirmationInfo.innerHTML = `
        <div style='text-align: center; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); max-width: 400px; margin: auto;'>
            <h2 style='color: #6b5b95; margin-bottom: 15px;'>Confirmação de Agendamento</h2>
            <p style='font-size: 18px; color: #333;'>Olá, <strong>${appointment.name}</strong>!</p>
            <p style='font-size: 16px;'>Seu agendamento:</p>
            <p style='font-size: 20px; font-weight: bold; color: #6b5b95;'>${appointment.day}, às ${appointment.time}</p>
            <p style='font-size: 16px; margin-top: 15px;'>Você confirma sua presença?</p>
        </div>
    `;
    confirmationActions.style.display = "flex";
    confirmationActions.style.justifyContent = "center";
    confirmationActions.style.marginTop = "20px";
    
    document.getElementById("confirm-yes").addEventListener("click", async () => {
        await updateStatus(id, "Confirmado");
    });

    document.getElementById("confirm-no").addEventListener("click", async () => {
        await updateStatus(id, "Não Confirmado");
    });

    async function updateStatus(id, status) {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        confirmationInfo.innerHTML = `
            <div style='text-align: center; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); max-width: 400px; margin: auto;'>
                <h2 style='color: ${status === "Confirmado" ? "green" : "red"}; margin-bottom: 15px;'>${status}</h2>
                <p style='font-size: 18px; color: #333;'>Obrigado! Seu agendamento foi <strong>${status.toLowerCase()}</strong>.</p>
            </div>
        `;
        confirmationActions.style.display = "none";
    }
});