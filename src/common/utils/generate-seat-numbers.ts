export default function generateSeatNumbers(
  capacity: number,
  seatsPerRow: number,
) {
  let seatNumbers: string[] = [];
  const rows = Math.ceil(capacity / seatsPerRow);

  for (let i = 0; i < rows; i++) {
    const row = String.fromCharCode(65, i);
    for (let j = 1; j <= seatsPerRow && seatNumbers.length < capacity; j++) {
      seatNumbers.push(`${row}${j}`);
    }
  }

  return seatNumbers;
}
