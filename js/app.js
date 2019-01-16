// Materialize

document.addEventListener('DOMContentLoaded', function() {
   let elems = document.querySelectorAll('.modal'),
       instances = M.Modal.init(elems);
});

// App

const formVehicle = document.getElementById('form-vehicle');
const parkedList = document.querySelector('#parked-vehicles tbody');

// Obtener datos del formulario

formVehicle.addEventListener('submit', e => {
   e.preventDefault();
   
   const vehicle = {
      type: formVehicle.typeVehicle.value,
      vehicleId: document.getElementById('vehicle-id').value.toUpperCase(),
      owner: document.getElementById('owner').value,
      ownerId: document.getElementById('owner-id').value,
      phone: document.getElementById('phone').value,
      time: 0,
      price: 0
   }

   // Validar información repetida.

   if (reapetedInfo(vehicle)) {
      alert('Esta información ya está registrada');
   } else {
      addStorage(vehicle);
   }
});

function reapetedInfo(vehicle) {
   for (let vehicleLS of parking.vehicles) {
      if (vehicle.vehicleId == vehicleLS.vehicleId || vehicle.ownerId == vehicleLS.ownerId || vehicle.phone == vehicleLS.phone) {
         return true;
      }
   }
}

// Crear o leer el registro en LocalStorage

function readStorage() {
   if (localStorage.getItem('parking') === null) {
      return {
         vehicles: [],
         incomes: {
            cars: 0,
            motorcycles: 0,
            total: 0
         }
      };
   } else {
      return JSON.parse(localStorage.getItem('parking'));
   }
}

let parking = readStorage();

// Añadir vehículo al LocalStorage

function addStorage(vehicle) {
   parking.vehicles.push(vehicle);
   localStorage.setItem('parking', JSON.stringify(parking));
   location.reload(true);
}

// Remover vehiculo de LocalStorage

parkedList.addEventListener('click', e => {
   if (e.target.className == 'material-icons clear') {
      removeVehicle(e.target.parentElement.parentElement.getAttribute('id'));
   };
});

function removeVehicle(vehicleId) {
   parking.vehicles.forEach((vehicle, i) => {
      if (vehicle.vehicleId == vehicleId) {
         incomes(vehicle.price, vehicle.type);
         parking.vehicles.splice(i, 1);
      }
   });

   localStorage.setItem('parking', JSON.stringify(parking));
   location.reload(true);
}

// Imprimir vehículos almacenados

function printVehicle(vehicle) {
   const item = document.createElement('tr');
   item.setAttribute("id", `${vehicle.vehicleId}`);

   item.innerHTML = `
      <td class="type">${vehicle.type}</td>
      <td>${vehicle.vehicleId}</td>
      <td style="text-transform: capitalize;">${vehicle.owner}</td>
      <td>${vehicle.ownerId}</td>
      <td>${vehicle.phone}</td>
      <td class="time">${vehicle.time}</td>
      <td class="price">$${vehicle.price}</td>
      <td><i class="material-icons clear">clear</i></td>
   `;

   parkedList.appendChild(item);  
}

document.addEventListener('DOMContentLoaded', () => {
   parking.vehicles.forEach(vehicle => { 
      printVehicle(vehicle)

      // Crear cronómetro para cada vehículo
      setInterval(() => {
         vehicle.time++;
         document.querySelector(`#${vehicle.vehicleId} .time`).innerText = vehicle.time;

         price(vehicle.vehicleId, vehicle.time, vehicle.type);
      }, 60000);
   });

   parkingSpaces();

   // Imprimir los datos del total recaudado

   document.getElementById('incomes-cars').innerText = `$${parking.incomes.cars}`;
   document.getElementById('incomes-motorcycles').innerText = `$${parking.incomes.motorcycles}`;
   document.getElementById('incomes-total').innerText = `$${parking.incomes.total}`;
});

// Calcular espacios de parqueo disponibles

function parkingSpaces() {
   let carsSpaces = 15,
   motorcyclesSpaces = 20;
   
   for (let vehicle of parking.vehicles) {
      if (vehicle.type == 'Automóvil') {
         carsSpaces --;
      } else if (vehicle.type == 'Motocicleta')  {
         motorcyclesSpaces--;
      }
   }

   document.getElementById('cars-parking-spaces').innerText = carsSpaces;
   document.getElementById('motorcycles-parking-spaces').innerText = motorcyclesSpaces;
};

// Calcular el precio y lo almacena junto al tiempo en el LocalStorage

function price(vehicleId, time, type) {
   let price;

   if (type == 'Automóvil') {
      price = time * 50;
   } else if (type == 'Motocicleta') {
      price = time * 35;
   }

   document.querySelector(`#${vehicleId} .price`).innerText = `$${price}`;

   parking.vehicles.forEach(vehicle => {
      if (vehicle.vehicleId == vehicleId) {
         vehicle.time = time;
         vehicle.price = price;
      }
   });

   localStorage.setItem('parking', JSON.stringify(parking));
}

// Registrar el total recaudado

function incomes(price, type) {
   let incomes = parking.incomes;

   if (type == 'Automóvil') {
      incomes.cars += price;
   } else if (type == 'Motocicleta') {
      incomes.motorcycles += price;
   }

   incomes.total = incomes.cars + incomes.motorcycles;
}