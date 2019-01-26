import {rand, point, angle, Coordinate} from './utils';

export class MapGen {
  private debug_mode: boolean = false;
  private COLOR_SEA_BLUE: string = "#7981c9";
  private COLOR_LAND_GREEN: string = "#bcae86";
  private context: CanvasRenderingContext2D;

  private number_of_guide_points: number;
  private map_radius: number;
  private major_city_min: number = 1;
  private major_city_max: number = 3;
  private minor_city_min: number = 1;
  private minor_city_max: number = 5;
  private motorways_min: number = 1;
  private motorway_max: number = 5;
  private major_roads_min: number = 5;
  private major_roads_max: number = 10;
  private minor_roads_min: number = 10;
  private minor_roads_max: number = 30;
  private county_border_points_min: number = 0;
  private county_border_points_max: number = 5;
  private county_border_count_min: number = 0;
  private county_border_count_max: number = 10;
  private river_seed_min: number = 1;
  private river_seed_max: number = 10;
  private lake_count_min: number = 0;
  private lake_count_max: number = 10;

  private circle_center_offset: Coordinate = [50, 50];
  private circle_center_coord: Coordinate;
  private guide_points: Coordinate[] = [];
  private border_points: Coordinate[] = [];
  private major_cities: Coordinate[] = [];
  private minor_cities: Coordinate[] = [];

  constructor(context: CanvasRenderingContext2D,
              number_of_guide_points: number,
              map_radius: number,
              debug_mode: boolean) {
    this.context = context;
    this.number_of_guide_points = number_of_guide_points;
    this.map_radius = map_radius;
    this.debug_mode = debug_mode;
    this.circle_center_coord = [map_radius + this.circle_center_offset[0], map_radius + this.circle_center_offset[1]];
  }

  generateRandomGuidePoints() {
    for (let i=0; i<this.number_of_guide_points; i++) {
      let angle = Math.random() * Math.PI*2;
      let x = Math.cos(angle) * this.map_radius + this.circle_center_coord[0];
      let y = Math.sin(angle) * this.map_radius + this.circle_center_coord[1];
      this.guide_points.push([x, y]);
    }

    // sort guide_points based on the angle each line (through point and circle centre) makes with x-axis
    var self = this;
    this.guide_points.sort(function (a: Coordinate, b: Coordinate) {
      return angle(a, self.circle_center_coord) - angle(b, self.circle_center_coord);
    });

    // add first point to end also, so map will close
    this.guide_points.push(this.guide_points[0]);
  }

  generateRandomCityPoints() {
    // major cities
    for (let i=0; i<rand(this.major_city_min, this.major_city_max); i++) {
      let new_point: Coordinate = this.getRandomPoint();
      if (this.context.isPointInPath(new_point[0], new_point[1])) {
        this.major_cities.push(new_point);
      } else {
        i--;
      }
    }

    // minor cities
    for (let i=0; i<rand(this.minor_city_min, this.minor_city_max); i++) {
      let new_point: Coordinate = this.getRandomPoint();
      if (this.context.isPointInPath(new_point[0], new_point[1])) {
        this.minor_cities.push(new_point);
      } else {
        i--;
      }
    }
  }

  generateBorder() {
    const max_inner_iterations: number = 10;
    let current_point: Coordinate = this.guide_points[0];

    for (let i=1; i<this.guide_points.length; i++) {

      for (let j=1; j<max_inner_iterations; j++) {

        let new_point: Coordinate = this.getRandomBorderPoint(current_point, this.guide_points[i], j, max_inner_iterations);
        this.border_points.push(new_point);
        current_point = new_point;

      }
    }
  }

  getRandomPoint(): Coordinate {
    let point_x: number = rand(0, this.context.canvas.clientWidth);
    let point_y: number = rand(0, this.context.canvas.clientHeight);
    return [point_x, point_y];
  }

  getRandomBorderPoint(current_point: Coordinate, target_point: Coordinate, j: number, n_steps: number) {
    const abs_distance = Math.hypot(target_point[0]-current_point[0], target_point[1]-current_point[1]);
    const min_noise: number = -0.2 * abs_distance;
    const max_noise: number = 0.2 * abs_distance;
    let step_distance = j/n_steps;
    let intermediate_point: Coordinate = [0,0];

    // get point on line 1/10th the way from current to target
    let slope = (target_point[1]-current_point[1])/(target_point[0]-current_point[0])
    let intermediate_point_x = (target_point[0]-current_point[0]) * step_distance + current_point[0]
    let intermediate_point_y = slope * (intermediate_point_x-current_point[0]) + current_point[1]

    intermediate_point[0] = intermediate_point_x + rand(min_noise, max_noise);
    intermediate_point[1] = intermediate_point_y + rand(min_noise, max_noise);
    return intermediate_point;
  }

  plot() {
    this.generateRandomGuidePoints();
    this.generateBorder();
  }

  plotIsPointInPathMethods() {
    this.generateRandomCityPoints();
  }

  drawIsPointInPathMethods() {
    for (let i=0; i<this.major_cities.length; i++) {
      point(this.major_cities[i][0], this.major_cities[i][1], this.context);
    }
  }

  draw() {
    if (this.debug_mode) {
      this.draw_debug();
    }

    // fill background
    this.context.fillStyle = this.COLOR_SEA_BLUE;
    this.context.fillRect(0, 0, 600, 600);

    // make regular drawings
    this.context.beginPath(); 
    this.context.moveTo(this.border_points[0][0], this.border_points[0][1]);

    for (let i=1; i<this.border_points.length; i++) {
      this.context.lineTo(this.border_points[i][0], this.border_points[i][1]);
    }

    // close the path
    this.context.lineTo(this.border_points[0][0], this.border_points[0][1]);

    // draw outer border
    //this.context.stroke();

    // anything that uses isPointInPath should be done here:
    this.plotIsPointInPathMethods();

    // fill land
    this.context.fillStyle = this.COLOR_LAND_GREEN;
    this.context.fill();

    // draw other features that rely on point in path method
    this.drawIsPointInPathMethods();
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
