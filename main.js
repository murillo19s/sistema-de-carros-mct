// main.js — sistema simples para adicionar carros e quilometragens
(function(){
  const STORAGE_KEY = 'carros_v1';
  const LOGIN_KEY = 'logged_in';

  const loginScreen = document.getElementById('login-screen');
  const mainContent = document.getElementById('main-content');
  const loginForm = document.getElementById('login-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  const form = document.getElementById('carro');
  const modelInput = document.getElementById('modelo');
  const plateInput = document.getElementById('placa');
  const kmInput = document.getElementById('km');
  const secretariaInput = document.getElementById('secretaria');
  const mesInput = document.getElementById('mes');
  const anoInput = document.getElementById('ano');
  const listEl = document.querySelector('#car-list tbody');
  const clearBtn = document.getElementById('clear-btn');
  const filterSecretaria = document.getElementById('filter-secretaria');
  const filterMes = document.getElementById('filter-mes');
  const filterAno = document.getElementById('filter-ano');

  let cars = [];
  let editId = null;

  function checkLogin() {
    return localStorage.getItem(LOGIN_KEY) === 'true';
  }

  function showLogin() {
    loginScreen.style.display = 'flex';
    mainContent.style.display = 'none';
  }

  function showMain() {
    loginScreen.style.display = 'none';
    mainContent.style.display = 'block';
  }

  function onLoginSubmit(e) {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    if (username === 'murillo' && password === 'mds123') {
      localStorage.setItem(LOGIN_KEY, 'true');
      showMain();
      load();
      render();
    } else {
      alert('Usuário ou senha incorretos.');
    }
    loginForm.reset();
  }

  function logout() {
    localStorage.removeItem(LOGIN_KEY);
    showLogin();
  }

  // Verificar login ao carregar
  if (checkLogin()) {
    showMain();
  } else {
    showLogin();
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      cars = raw ? JSON.parse(raw) : [];
    } catch (e) {
      cars = [];
    }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
  }

  function render() {
    listEl.innerHTML = '';
    const filterSecValue = filterSecretaria.value;
    const filterMesValue = filterMes.value;
    const filterAnoValue = filterAno.value;

    let filteredCars = cars;

    if (filterSecValue) {
      filteredCars = filteredCars.filter(car => car.secretaria === filterSecValue);
    }
    if (filterMesValue) {
      filteredCars = filteredCars.filter(car => car.mes === filterMesValue);
    }
    if (filterAnoValue) {
      filteredCars = filteredCars.filter(car => car.ano === filterAnoValue);
    }

    if (filteredCars.length === 0) {
      listEl.innerHTML = `<tr class="empty"><td colspan="7">Nenhum veículo encontrado com os filtros aplicados.</td></tr>`;
      return;
    }

    filteredCars.forEach(car => {
      const tr = document.createElement('tr');
      const mesNome = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][parseInt(car.mes) - 1] || car.mes;
      tr.innerHTML = `
        <td>${escapeHtml(car.model)}</td>
        <td>${escapeHtml(car.plate)}</td>
        <td>${car.km} km</td>
        <td>${escapeHtml(car.secretaria || 'N/A')}</td>
        <td>${mesNome}</td>
        <td>${car.ano}</td>
        <td>
          <button data-action="edit" data-id="${car.id}">Editar</button>
          <button data-action="delete" data-id="${car.id}" class="danger">Remover</button>
        </td>
      `;

      listEl.appendChild(tr);
    });
  }

  function addCar(model, plate, km, secretaria, mes, ano) {
    const car = { id: Date.now().toString(), model, plate, km, secretaria, mes, ano };
    cars.push(car);
    save();
    render();
  }

  function updateCar(id, model, plate, km, secretaria, mes, ano) {
    const idx = cars.findIndex(c => c.id === id);
    if (idx === -1) return;
    cars[idx].model = model;
    cars[idx].plate = plate;
    cars[idx].km = km;
    cars[idx].secretaria = secretaria;
    cars[idx].mes = mes;
    cars[idx].ano = ano;
    save();
    render();
  }

  function removeCar(id) {
    cars = cars.filter(c => c.id !== id);
    save();
    render();
  }

  function clearAll() {
    if (!confirm('Remover todos os veículos?')) return;
    cars = [];
    save();
    render();
  }

  function onFormSubmit(e) {
    e.preventDefault();
    const model = modelInput.value.trim();
    const plate = plateInput.value.trim();
    const km = Number(kmInput.value);
    const secretaria = secretariaInput.value;
    const mes = mesInput.value;
    const ano = anoInput.value;
    if (!model || isNaN(km) || !secretaria || !mes || !ano) return alert('Preencha todos os campos obrigatórios.');

    if (editId) {
      updateCar(editId, model, plate, km, secretaria, mes, ano);
      editId = null;
      form.querySelector('#add-btn').textContent = 'Adicionar / Atualizar';
    } else {
      addCar(model, plate, km, secretaria, mes, ano);
    }

    form.reset();
  }

  function onListClick(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    if (action === 'edit') {
      const car = cars.find(c => c.id === id);
      if (!car) return;
      modelInput.value = car.model;
      plateInput.value = car.plate || '';
      kmInput.value = car.km;
      secretariaInput.value = car.secretaria || '';
      mesInput.value = car.mes || '';
      anoInput.value = car.ano || '';
      editId = id;
      form.querySelector('#add-btn').textContent = 'Salvar alteração';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action === 'delete') {
      if (confirm('Remover este veículo?')) removeCar(id);
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function downloadReport() {
    if (cars.length === 0) {
      alert('Nenhum veículo cadastrado para gerar relatório.');
      return;
    }

    const totalKm = cars.reduce((sum, car) => sum + car.km, 0);
    const averageKm = totalKm / cars.length;

    // Estatísticas por secretaria
    const statsBySecretaria = {};
    cars.forEach(car => {
      const sec = car.secretaria || 'N/A';
      if (!statsBySecretaria[sec]) {
        statsBySecretaria[sec] = { count: 0, totalKm: 0 };
      }
      statsBySecretaria[sec].count++;
      statsBySecretaria[sec].totalKm += car.km;
    });

    // Estatísticas por mês/ano
    const statsByPeriodo = {};
    cars.forEach(car => {
      const periodo = `${car.ano}-${car.mes}`;
      if (!statsByPeriodo[periodo]) {
        statsByPeriodo[periodo] = { count: 0, totalKm: 0 };
      }
      statsByPeriodo[periodo].count++;
      statsByPeriodo[periodo].totalKm += car.km;
    });

    let report = `Relatório de Média de Quilometragem\n\nTotal de veículos: ${cars.length}\nQuilometragem total: ${totalKm} km\nMédia geral de quilometragem: ${averageKm.toFixed(2)} km\n\n`;

    report += 'Estatísticas por Secretaria:\n';
    for (const [sec, stats] of Object.entries(statsBySecretaria)) {
      const avg = stats.totalKm / stats.count;
      report += `- ${sec}: ${stats.count} veículo(s), ${stats.totalKm} km total, média ${avg.toFixed(2)} km\n`;
    }

    report += '\nEstatísticas por Período (Ano-Mês):\n';
    for (const [periodo, stats] of Object.entries(statsByPeriodo).sort()) {
      const avg = stats.totalKm / stats.count;
      const [ano, mes] = periodo.split('-');
      const mesNome = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][parseInt(mes) - 1] || mes;
      report += `- ${mesNome} ${ano}: ${stats.count} veículo(s), ${stats.totalKm} km total, média ${avg.toFixed(2)} km\n`;
    }

    report += `\nData do relatório: ${new Date().toLocaleString('pt-BR')}`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio_media_quilometragem.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Inicialização
  if (checkLogin()) {
    load();
    render();
  }

  loginForm.addEventListener('submit', onLoginSubmit);
  document.getElementById('logout-btn').addEventListener('click', logout);
  form.addEventListener('submit', onFormSubmit);
  listEl.addEventListener('click', onListClick);
  clearBtn.addEventListener('click', clearAll);
  document.getElementById('download-report-btn').addEventListener('click', downloadReport);
  filterSecretaria.addEventListener('change', render);
  filterMes.addEventListener('change', render);
  filterAno.addEventListener('input', render);
})();
