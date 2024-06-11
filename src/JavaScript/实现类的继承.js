function Parent(name) {
  this.name = name;
}

Parent.prototype.speak = function () {
  console.log(this.name);
};

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

const c = new Child("Jay", 18);

c.speak();
