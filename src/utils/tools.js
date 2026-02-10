const urlAPIServer = `https://api-acamp.gfq513.com.br/api/v1`
const userModule = `users`
const reportsByChurchModule = `reports/resume-by-church`
const registerCheckinEndpoint = `frontdesk/checkin`
const registerCheckoutEndpoint = `frontdesk/checkout`

const getAge = function (date) {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

const getDate = () => {
    let date = new Date();
    return stringDate = ((date.getHours() < 9 ? `0${date.getHours()}` : date.getHours()) + ":" + (date.getMinutes() < 9 ? `0${date.getMinutes()}` : date.getMinutes()) + " & " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear());
}

const formatDate = (date) => {
    let newDate = new Date(date);

    let hours = newDate.getHours().toString().padStart(2, "0");
    let minutes = newDate.getMinutes().toString().padStart(2, "0");
    let day = newDate.getDate().toString().padStart(2, "0");
    let month = (newDate.getMonth() + 1).toString().padStart(2, "0");
    let year = newDate.getFullYear();

    return `${hours}:${minutes} | ${day}/${month}/${year}`;
};

const setCssExtendContent = function () {
    const css = document.getElementById('cssContent');

    css.setAttribute('href', '../stylesheet/extend-content.css');
}

const setCssDefaultContent = function () {
    const css = document.getElementById('cssContent');

    css.setAttribute('href', '../stylesheet/default-content.css');
}

const copyToClipboard = async () => {
    const response = await getAllUsers('checkin=true');
    let content = '';

    for (let i = 0; i < response.data.data.docs.length; i++) {
        const user = response.data.data.docs[i];
        content += `${user.name}` + '\n';
    }

    navigator.clipboard.writeText(content);
}