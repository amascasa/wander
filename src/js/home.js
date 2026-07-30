const countries = [

    {
        name: "Guatemala",
        image: "assets/images/guatemala.jpg",
        description: "Adventure + Culture",
        score: 94
    },

    {
        name: "Japan",
        image: "assets/images/japan.jpg",
        description: "Photography + Food",
        score: 91
    },

    {
        name: "Iceland",
        image: "assets/images/iceland.jpg",
        description: "Geology + Landscapes",
        score: 89
    },

    {
        name: "Mexico",
        image: "assets/images/mexico.jpg",
        description: "Affordable Adventure",
        score: 87
    },

    {
        name: "Norway",
        image: "assets/images/norway.jpg",
        description: "Mountains + Light",
        score: 85
    }

];



function buildCountryTiles(){

    const grid = document.getElementById("country-grid");


    if(!grid){
        return;
    }


    grid.innerHTML = "";


    countries.forEach((country,index)=>{


        const tile = document.createElement("a");


        tile.className = "country-tile";


        if(index === 0){

            tile.classList.add("hero");

        }



        tile.innerHTML = `

            <img 
                src="${country.image}"
                loading="lazy"
            >


            <div>

                <h2>
                    ${country.name}
                </h2>


                <p>
                    ${country.description}
                </p>


                <span>
                    Wander Score: ${country.score}
                </span>

            </div>

        `;


        grid.appendChild(tile);


    });


}



document.addEventListener(
    "DOMContentLoaded",
    buildCountryTiles
);