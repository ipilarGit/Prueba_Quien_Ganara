const axios = require("axios");
const getUserRandom = async() => {
    const { data } = await axios.get("https://randomuser.me/api");
    const user = data.results[0];

    const { title: titulo, first: nombre, last: apellido } = user.name;
    const { country: pais } = user.location;
    const { thumbnail: img } = user.picture;

    const userRandom = {
        titulo,
        email: user.email,
        nombre,
        apellido,
        pais,
        img
    };
    /*   console.log(userRandom); */
    return userRandom;
};

module.exports = getUserRandom;