import Account from "../src/Account"

test("Deve criar uma conta", function(){
    const account = Account.create("John Doe","john.doe@email.com","97456321558","","123456",true,false)
    expect(account.accountId).toBeDefined();
    expect(account.name).toBe("John Doe")
})

test("Nao deve criar uma conta com o nome inválido", function(){
    expect(()=> Account.create("JohnDoe","john.doe@email.com","97456321558","","123456",true,false)).toThrow("Invalid name");
})

test("Nao deve criar uma conta com o cpf inválido", function(){
    expect(()=> Account.create("John Doe","john.doe@email.com","97456321550","","123456",true,false)).toThrow("Invalid cpf");
})

test("Nao deve criar uma conta com o email inválido", function(){
    expect(()=> Account.create("John Doe","john.doeemail.com","97456321558","","123456",true,false)).toThrow("Invalid email");
})

test("Nao deve criar uma conta com o placa do carro inválido", function(){
    expect(()=> Account.create("John Doe","john.doe@email.com","97456321558","AAA-BCD2","123456",false,true)).toThrow("Invalid car plate");
})