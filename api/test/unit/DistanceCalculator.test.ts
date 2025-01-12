import Position from "../../src/domain/entity/Position";
import DistanceCalculator from "../../src/domain/service/DistanceCalculator";
import Coord from "../../src/domain/vo/Coord";

test("Deve calcular a distancia entre duas coordenadas", function(){
    const positionFrom = Position.create("",-27.584905257808835,-48.545022195325124);
    const positionTo = Position.create("",-27.496887588317275,-48.522234807851476);    
    const positions = [positionFrom,positionTo];    
    expect(DistanceCalculator.calculateBetweenPositions(positions)).toBe(10);
})