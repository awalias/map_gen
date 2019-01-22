import {rand, point, angle, Coordinate} from './utils';

export class MapGen {
  private context: CanvasRenderingContext2D;
  private number_of_guide_points: number;
  private map_radius: number;
  private guide_points: Coordinate[] = [];
  private debug_mode: boolean = false;
  private circle_center_coord: Coordinate = [250, 250];

  constructor(context: CanvasRenderingContext2D,
              number_of_guide_points: number,
              map_radius: number,
              debug_mode: boolean) {
    this.context = context;
    this.number_of_guide_points = number_of_guide_points;
    this.map_radius = map_radius;
    this.debug_mode = debug_mode;
  }

  generateRandomGuidePoints() {
    for (let i=0; i<this.number_of_guide_points; i++) {
      let angle = Math.random() * Math.PI*2;
      let x = Math.cos(angle) * this.map_radius + this.circle_center_coord[0];
      let y = Math.sin(angle) * this.map_radius + this.circle_center_coord[1];
      this.guide_points.push([x, y]);
    }

    // sort guide_points based on the angle each point makes with the X-axis
    var self = this;
    this.guide_points.sort(function (a: Coordinate, b: Coordinate) {
      return angle(a, self.circle_center_coord) - angle(b, self.circle_center_coord);
    });

    console.log(this.guide_points);
    console.log(this.guide_points.map((p)=>{return Math.atan2(p[0], p[1])}));
  }

  plot() {
    this.generateRandomGuidePoints();
  }

  draw() {
    const BORDER_START_X = 50;
    const BORDER_START_Y = 50;
    const BORDER_MAX_STEPS = 100;
    const MIN_STEP_PIXELS = 2;
    const MAX_STEP_PIXELS = 10;

    if (this.debug_mode) {
      this.draw_debug();
    }

    // make regular drawings
    // this.context.beginPath(); 
    // this.context.moveTo(this.guide_points[0][0], this.guide_points[0][1]);

    for (let i=1; i<this.guide_points.length; i++) {
      // for (let j=0; j<20; j++) {
        
        // this.context.lineTo(this.guide_points[i][0], this.guide_points[i][1]);
        // this.context.stroke();

      //}
    }
  }

  draw_debug() {
    // make debug drawings
    this.context.beginPath(); 
    this.context.moveTo(this.guide_points[0][0], this.guide_points[0][1]);

    // connect cirlce plot points
    for (let i=1; i<this.guide_points.length; i++) {
      this.context.lineTo(this.guide_points[i][0], this.guide_points[i][1]);
      this.context.stroke();
    }

    // draw circle points
    for (let i=1; i<this.guide_points.length; i++) {
      point(this.guide_points[i][0], this.guide_points[i][1], this.context);
    }

    // draw circle center
    point(this.circle_center_coord[0], this.circle_center_coord[1], this.context);
  }
}
