class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
    this.ano = ano;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }

  validarDados() {
    for (let i in this) {
      if (this[i] == undefined || this[i] == "" || this[i] == null) {
        return false;
      }
    }
    return true;
  }
}

class Bd {
  constructor() {
    let id = localStorage.getItem("id");

    if (id === null) {
      localStorage.setItem("id", 0);
    }
  }

  getProximoId() {
    let proximoId = localStorage.getItem("id");
    return parseInt(proximoId) + 1;
  }

  gravar(d) {
    let id = this.getProximoId();
    localStorage.setItem(id, JSON.stringify(d));
    localStorage.setItem("id", id);
  }

  recuperarTodosRegistros() {
    //array de despesas
    let despesas = Array();

    let id = localStorage.getItem("id");

    //recuperar todas as despesas cadastradas em localStorage
    for (let i = 1; i <= id; i++) {
      //recuperar despesa
      let despesa = JSON.parse(localStorage.getItem(i));

      // pode haver itens pulados/removidos
      // nesse casos nós valos pular esses itens
      if (despesa === null) {
        continue;
      }

      despesa.id = i;
      despesas.push(despesa);
    }
    return despesas;
  }

  pesquisar(despesa) {
    let despesasFiltradas = Array();
    despesasFiltradas = this.recuperarTodosRegistros();

    // recuperar ano
    if (despesa.ano != "") {
      despesasFiltradas = despesasFiltradas.filter((d) => d.ano == despesa.ano);
    }

    // recuperar mes
    if (despesa.mes != "") {
      despesasFiltradas = despesasFiltradas.filter((d) => d.mes == despesa.mes);
    }
    // recuperar dia
    if (despesa.dia != "") {
      despesasFiltradas = despesasFiltradas.filter((d) => d.dia == despesa.dia);
    }
    // recuperar tipo
    if (despesa.tipo != "") {
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.tipo == despesa.tipo
      );
    }
    // recuperar descricao
    if (despesa.descricao != "") {
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.descricao == despesa.descricao
      );
    }
    // recuperar valor
    if (despesa.valor != "") {
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.valor == despesa.valor
      );
    }
    return despesasFiltradas;
  }

  remover(id) {
    localStorage.removeItem(id);
  }
}

let bd = new Bd();

function cadastrarDespesa() {
  let ano = document.getElementById("ano");
  let mes = document.getElementById("mes");
  let dia = document.getElementById("dia");
  let tipo = document.getElementById("tipo");
  let descricao = document.getElementById("descricao");
  let valor = document.getElementById("valor");

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  );

  if (despesa.validarDados()) {
    bd.gravar(despesa);

    //personaliza modal
    document.getElementById("titulo").innerHTML =
      "Registro inserido com sucesso";
    document.getElementById("titulo-div").className =
      "modal-header text-success";
    document.getElementById("texto").innerHTML =
      "Despesa foi cadastrada com sucesso!";
    document.getElementById("botao").innerHTML = "Voltar";

    document.getElementById("botao").className = "btn btn-success";

    //limpar campos
    ano.value = "";
    mes.value = "";
    dia.value = "";
    tipo.value = "";
    descricao.value = "";
    valor.value = "";

    //dialog de sucesso
    $("#modalRegistroDespesa").modal("show");
    //
  } else {
    //personaliza modal
    document.getElementById("titulo").innerHTML = "Erro na gravação";
    document.getElementById("titulo-div").className =
      "modal-header text-danger";
    document.getElementById("texto").innerHTML =
      "Existem campos obrigatórios que não foram preenchidos.";
    document.getElementById("botao").innerHTML = "Corrigir";
    document.getElementById("botao").className = "btn btn-danger";

    //dialog de erro
    $("#modalRegistroDespesa").modal("show");
  }
}

function carregaListaDespesas(despesas = Array(), filtro = false) {
  if (despesas.length == 0 && filtro == false) {
    despesas = bd.recuperarTodosRegistros();
  }

  //selecionando tbody da tabela
  let listaDespesas = document.getElementById("listaDespesas");
  listaDespesas.innerHTML = "";

  //percorre array despesas listando cada despesa de forma dinâmica
  despesas.forEach(function (d) {
    //criando a linha (tr)
    let linha = listaDespesas.insertRow();

    //criar as colunas (td) e atribuir seus conteúdos
    linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;

    //ajustar o tipo
    switch (parseInt(d.tipo)) {
      case 1:
        d.tipo = "Alimentação";
        break;
      case 2:
        d.tipo = "Educação";
        break;
      case 3:
        d.tipo = "Lazer";
        break;
      case 3:
        d.tipo = "Saúde";
        break;
      case 3:
        d.tipo = "Transporte";
    }

    linha.insertCell(1).innerHTML = d.tipo;
    linha.insertCell(2).innerHTML = d.descricao;
    linha.insertCell(3).innerHTML = d.valor;

    //criar o botão de exclusão
    let btn = document.createElement("button");
    btn.className = "btn btn-danger btn-sm";
    btn.innerHTML = '<i class="fas fa-times"></i>';
    btn.id = `id_despesa_${d.id}`;
    btn.onclick = function () {
      //arrumar a string antes de remover
      let id = this.id.replace("id_despesa_", "");
      //remover a despesa
      bd.remover(id);

      window.location.reload();
    };
    linha.insertCell(4).append(btn);
  });
}

function pesquisarDespesa() {
  let ano = document.getElementById("ano").value;
  let mes = document.getElementById("mes").value;
  let dia = document.getElementById("dia").value;
  let tipo = document.getElementById("tipo").value;
  let descricao = document.getElementById("descricao").value;
  let valor = document.getElementById("valor").value;

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

  let despesas = bd.pesquisar(despesa);

  carregaListaDespesas(despesas, true);
}
