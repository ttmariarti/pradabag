class Key {
  private readonly signature = Math.random();

  getSignature(): number {
    return this.signature;
  }
}

class Person {
  constructor(private readonly key: Key) {}

  getKey(): Key {
    return this.key;
  }
}

abstract class House {
  door = false;
  readonly tenants: Person[] = [];

  constructor(protected readonly key: Key) {}

  comeIn(person: Person): void {
    if (this.door) {
      this.tenants.push(person);
    }
  }

  abstract openDoor(key: Key): void;
}

class MyHouse extends House {
  openDoor(key: Key): void {
    this.door = key.getSignature() === this.key.getSignature();
  }
}

const houseKey = new Key();
const person = new Person(houseKey);
const house = new MyHouse(houseKey);

const doorStatus = document.getElementById("door-status");
const entryStatus = document.getElementById("entry-status");
const tenantCount = document.getElementById("tenant-count");
const openDoorButton = document.getElementById("open-door");
const wrongKeyButton = document.getElementById("wrong-key");
const enterButton = document.getElementById("come-in");

if (
  !(doorStatus instanceof HTMLParagraphElement) ||
  !(entryStatus instanceof HTMLParagraphElement) ||
  !(tenantCount instanceof HTMLParagraphElement) ||
  !(openDoorButton instanceof HTMLButtonElement) ||
  !(wrongKeyButton instanceof HTMLButtonElement) ||
  !(enterButton instanceof HTMLButtonElement)
) {
  throw new Error("Не знайдено елементи керування будинком.");
}

const doorStatusElement = doorStatus;
const tenantCountElement = tenantCount;

function updateDoorStatus(): void {
  doorStatusElement.textContent = house.door
    ? "Двері відчинені"
    : "Двері зачинені";
}

function updateTenantCount(): void {
  tenantCountElement.textContent = `Мешканців у будинку: ${house.tenants.length}`;
}

openDoorButton.addEventListener("click", () => {
  house.openDoor(person.getKey());
  updateDoorStatus();
  entryStatus.textContent = house.door
    ? "Ключ підійшов. Можна заходити."
    : "Ключ не підійшов. Двері залишилися зачиненими.";
});

wrongKeyButton.addEventListener("click", () => {
  house.openDoor(new Key());
  updateDoorStatus();
  entryStatus.textContent = "Спроба з чужим ключем: двері зачинені.";
});

enterButton.addEventListener("click", () => {
  if (!house.door) {
    entryStatus.textContent = "Спочатку потрібно відчинити двері ключем.";
    return;
  }

  house.comeIn(person);
  updateTenantCount();
  entryStatus.textContent = "Ви увійшли до будинку.";
});

updateDoorStatus();
updateTenantCount();
