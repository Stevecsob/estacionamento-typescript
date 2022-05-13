interface Veículo {
    nome: string;
    placa: string;
    entrada: Date | string;
}

(function(){
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query)

    function calcTempo(mil: number){
        const min = Math.floor(mil / 60000)
        const sec = Math.floor((mil % 60000) / 1000)

        return `${min}m e ${sec}s`
    }

    function patio() {
        function ler(): Veículo[] {
            return localStorage.patio ? JSON.parse(localStorage.patio) : []
        }

        function salvar(veículo: Veículo [] ){
            localStorage.setItem('patio', JSON.stringify(veículo))
        }

        function adicionar(veículo: Veículo, salva?: boolean){
            const row = document.createElement("tr")

            row.innerHTML = `
                <td>${veículo.nome}</td>
                <td>${veículo.placa}</td>
                <td>${veículo.entrada}</td>
                <td>
                    <button class="delete" data-placa="${veículo.placa}"> X </button>
                </td>
                `

            row.querySelector(".delete")?.addEventListener("click", function(){
                remover(this.dataset.placa)
            })
                
            $("#patio")?.appendChild(row)  
            
            if (salva) salvar([...ler(), veículo])
        }

        function remover(placa: string){
            
            const { entrada, nome } = ler().find(veículo => veículo.placa === placa)

            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime())

            if(!confirm(`O veículo ${nome}, permaneuceu por ${tempo}, deseja encerrar?`)) return
            
            salvar(ler().filter(veículo => veículo.placa !== placa))
            renderizar()

        }

        function renderizar(){
            $("#patio")!.innerHTML = ""
            const patio = ler()

            if (patio.length) { 
            patio.forEach((veículo) => adicionar(veículo))                 
            }
        }

        return { ler, adicionar, remover, salvar, renderizar }
    }
   
    patio().renderizar()
    
    $("#cadastrar")?.addEventListener("click", () => {
        const nome = $("#nome")?.value
        const placa = $("#placa")?.value

        if(!nome || !placa){
            alert("Os campos nome e placa são obrigatórios.")
            return
        }

        patio().adicionar({nome, placa, entrada: new Date().toISOString()}, true)

    })
})()