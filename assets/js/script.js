const input = document.querySelector('input')
const select = document.getElementById('select')
const button = document.querySelector('button')
const resultado = document.querySelector('h2')
const graficoDOM = document.getElementById('grafico')
const grafico =  new Chart (graficoDOM, {type: 'line'})

button.addEventListener('click', async () => {
    const montoPesos = input.value
    const tipoMoneda = select.value
    const resServicioAPI = await mindicadorAPI(tipoMoneda)
    if(resServicioAPI){
        const serieMoneda = obtenerSerie(resServicioAPI)
        console.log(serieMoneda)
        const montoConversion = calcularRes(montoPesos, serieMoneda)
        console.log(montoConversion)
        pintarResConversion(montoConversion)

        const datosGrafico = formatearDatos(serieMoneda)
        pintarGráfico(datosGrafico)
    }
})

const mindicadorAPI = async (moneda) => {
    try {
        const resAPI = await fetch(`https://mindicador.cl/api/${moneda}`)
        const dataAPI = await resAPI.json()
        return dataAPI
    } catch (error) {
        console.error('Algo salió mal: ',error)
    }
}

const obtenerSerie = (dataAPI) => {
    const serie = dataAPI.serie.slice(0, 10)
    return serie
}

const calcularRes = (montoCLP, serieMoneda) => {
    const valorActual = serieMoneda[0].valor
    const resConversion = Number(montoCLP / valorActual).toFixed(2)
    return resConversion
}

const pintarResConversion = (montoConversion) => {
    resultado.innerHTML = `Resultado: $${montoConversion}`
}

const formatearDatos = (serieMoneda) => {
    const valoresFecha = serieMoneda.map((serie) => {
        const fechaFormateada = serie.fecha.slice(0,10)
        return fechaFormateada
    })
    const valoresMoneda = serieMoneda.map((serie) => {
        return serie.valor
    })
    console.log(valoresFecha, valoresMoneda)
    const dataGrafico = {
        labels: valoresFecha,
        datasets: [{
            label: 'Historial últimos 10 días',
            data: valoresMoneda,
            borderColor: "rgb(255, 99, 132)",
            borderWidth: 1
        }]
    }
    return dataGrafico
}

const pintarGráfico = (datosGrafico) => {
    grafico.data = datosGrafico
    grafico.update()
}

