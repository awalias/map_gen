
export type Coordinate = [number, number];

export function rand(min: number, max: number) {
  var min = Math.ceil(min);
  var max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function point(x: number, y: number, context: CanvasRenderingContext2D): Promise<void>  {
  context.beginPath();
  context.arc(x, y, 1, 0, 2 * Math.PI, true);
  context.fill();	
}

export function angle(a: Coordinate, b: Coordinate): number {
	return Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
}

// wait used for animated debugging
export function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}