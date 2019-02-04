import {rand, point, angle, Coordinate} from './utils';

export class MapGen {
  private debug_mode: boolean = false;
  private color_sea_blue: string = "#7981c9";
  private color_land_green: string = "#bcae86";
  private color_text_shadow: string = "#ffffff"
  private color_text_label: string = "#000000";
  private color_motorway_main: string = "#ebc247"
  private motorway_line_width: number = 2;
  private context: CanvasRenderingContext2D;

  private number_of_guide_points: number;
  private map_radius: number;
  private major_city_min: number = 1;
  private major_city_max: number = 3;
  private minor_city_min: number = 1;
  private minor_city_max: number = 5;
  private motorways_min: number = 1;
  private motorways_max: number = 5;
  private major_roads_min: number = 5;
  private major_roads_max: number = 10;
  private county_border_points_min: number = 0;
  private county_border_points_max: number = 5;
  private county_border_count_min: number = 0;
  private county_border_count_max: number = 10;
  private river_seed_min: number = 1;
  private river_seed_max: number = 10;
  private lake_count_min: number = 0;
  private lake_count_max: number = 10;

  private major_city_point_radius: number = 1.5;
  private minor_city_point_radius: number = 1.5;

  private text_offset: Coordinate = [5, 10];
  private circle_center_offset: Coordinate = [50, 50];
  private circle_center_coord: Coordinate;
  private guide_points: Coordinate[] = [];
  private border_points: Coordinate[] = [];
  private major_cities: Coordinate[] = [];
  private minor_cities: Coordinate[] = [];

  private motorways: Coordinate[][] = [];

  private major_city_labels: string[] = [];
  private minor_city_labels: string[] = [];

  private city_label_dictionary: string[] = [];
  private city_label_suffixes: string[] = [];

  constructor(context: CanvasRenderingContext2D,
              number_of_guide_points: number,
              map_radius: number,
              debug_mode: boolean,
              city_label_dictionary: string[],
              city_label_suffixes: string[]) {
    this.context = context;
    this.number_of_guide_points = number_of_guide_points;
    this.map_radius = map_radius;
    this.debug_mode = debug_mode;
    this.city_label_dictionary = city_label_dictionary;
    this.city_label_suffixes = city_label_suffixes;
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
      let new_point: Coordinate = this.getRandomPointOnLand();
      this.major_cities.push(new_point);
    }

    // minor cities
    for (let i=0; i<rand(this.minor_city_min, this.minor_city_max); i++) {
      let new_point: Coordinate = this.getRandomPointOnLand();
      this.minor_cities.push(new_point);
    }

    this.generateRandomCityLabels();
  }

  generateRandomCityLabels() {
    for (let i=0; i<this.major_cities.length; i++) {
      this.major_city_labels.push(this.getRandomCityLabel());
    }

    for (let i=0; i<this.minor_cities.length; i++) {
      this.minor_city_labels.push(this.getRandomCityLabel());
    }
  }

  getRandomCityLabel(): string {
    let label: string = "";
    label = label.concat(this.city_label_dictionary[rand(0, this.city_label_dictionary.length-1)]);

    label = label.concat(" ");
    label = label.concat(this.city_label_dictionary[rand(0, this.city_label_dictionary.length-1)]);

    if (rand(0,1)) {
      label = label.concat(" ");
      label = label.concat(this.city_label_suffixes[rand(0, this.city_label_suffixes.length-1)]);
    }

    return label;
  }

  generateBorder() {
    const max_inner_iterations: number = 10;
    let current_point: Coordinate = this.guide_points[0];

    for (let i=1; i<this.guide_points.length; i++) {

      for (let j=1; j<max_inner_iterations; j++) {

        let new_point: Coordinate = this.getRandomIntermediatePoint(current_point, this.guide_points[i], j, max_inner_iterations);
        this.border_points.push(new_point);
        current_point = new_point;

      }
    }
  }

  getRandomPoint():Coordinate {
    let point_x: number = rand(0, this.context.canvas.clientWidth);
    let point_y: number = rand(0, this.context.canvas.clientHeight);
    return [point_x, point_y];
  }

  getRandomPointOnLand(): Coordinate {
    let point: Coordinate = [0,0]

    while (!this.context.isPointInPath(point[0], point[1])) {
      point = this.getRandomPoint();
    }

    return point;
  }

  getRandomIntermediatePoint(current_point: Coordinate, target_point: Coordinate, j: number, n_steps: number, min_noise_seed: number = -0.2, max_noise_seed: number = 0.2) {
    const abs_distance = Math.hypot(target_point[0]-current_point[0], target_point[1]-current_point[1]);
    const min_noise: number = min_noise_seed * abs_distance;
    const max_noise: number = max_noise_seed * abs_distance;
    let step_distance = j/n_steps;
    let intermediate_point: Coordinate = [0,0];

    // get point on line 1/n_steps the way from current to target
    let slope = (target_point[1]-current_point[1])/(target_point[0]-current_point[0])
    let intermediate_point_x = (target_point[0]-current_point[0]) * step_distance + current_point[0]
    let intermediate_point_y = slope * (intermediate_point_x-current_point[0]) + current_point[1]

    intermediate_point[0] = intermediate_point_x + rand(min_noise, max_noise);
    intermediate_point[1] = intermediate_point_y + rand(min_noise, max_noise);
    return intermediate_point;
  }

  generateMotorways() {
    for (let i=0; i<rand(this.motorways_min, this.motorways_max); i++) {
      this.motorways.push(this.generateMotorway());
    }
  }

  generateMotorway(): Coordinate[] {
    let motorway: Coordinate[] = [];
    let starting_point: Coordinate = [0, 0];
    let current_point: Coordinate;
    let destination_point: Coordinate = [0, 0];
    let n_steps: number = rand(30, 40);

    // motorway will connect major city (or random point) and a random point
    let starting_city: Coordinate =  rand(0, 2) ? this.getRandomPointOnLand() : this.major_cities[rand(0, this.major_cities.length-1)];
    let destination_city: Coordinate = this.getRandomPointOnLand();


    // motorway doesn't have to start in the city centre - add some noise
    let safety_count: number = 0;
    while (!this.context.isPointInPath(starting_point[0], starting_point[1])) {
      starting_point = [starting_city[0] + rand(-20,20), starting_city[1] + rand(-20, 20)];

      safety_count++;
      if (safety_count > 10) {
        return [];
      }
    }

    motorway.push(starting_point);
    current_point = starting_point;

    // motorway doesn't have to end in the city centre - add some noise
    safety_count = 0;
    while (!this.context.isPointInPath(destination_point[0], destination_point[1])) {
      destination_point = [destination_city[0] + rand(-20,20), destination_city[1] + rand(-20, 20)];

      safety_count++;
      if (safety_count > 10) {
        return [];
      }
    }

    for (let i=0; i<n_steps; i++) {
      let new_point: Coordinate = [0, 0];
      safety_count = 0;
      while (!this.context.isPointInPath(new_point[0], new_point[1])) {
        new_point = this.getRandomIntermediatePoint(current_point, destination_point, i, n_steps, -0.1, 0.1);

        safety_count++;
        if (safety_count > 10) {
          return [];
        }
      }
      motorway.push(new_point);
      current_point = new_point;
    }

    // pop the first point since it occasionally comes out looking strange
    motorway.shift();
    motorway.shift();
    return motorway;
  }

  plot() {
    this.generateRandomGuidePoints();
    this.generateBorder();
  }

  plotIsPointInPathMethods() {
    this.generateRandomCityPoints();
    this.generateMotorways();
  }

  drawIsPointInPathMethods() {
    // draw major cities
    for (let i=0; i<this.major_cities.length; i++) {
      point(this.major_cities[i][0], this.major_cities[i][1], this.major_city_point_radius, this.context);
      this.context.font = "14px Helvetica";

      this.context.shadowColor = this.color_text_shadow;
      this.context.shadowBlur = 4;
      this.context.fillStyle = this.color_text_label;
      this.context.fillText(this.major_city_labels[i], this.major_cities[i][0]+this.text_offset[0], this.major_cities[i][1]+this.text_offset[1]);
      this.context.shadowColor = "rgba(0,0,0,0)";
      this.context.shadowBlur = 0;
    }

    // draw minor cities
    for (let i=0; i<this.minor_cities.length; i++) {
      point(this.minor_cities[i][0], this.minor_cities[i][1], this.minor_city_point_radius, this.context);
      this.context.font = "12px Helvetica";

      this.context.shadowColor = this.color_text_shadow;
      this.context.shadowBlur = 4;
      this.context.fillStyle = this.color_text_label;
      this.context.fillText(this.minor_city_labels[i], this.minor_cities[i][0]+this.text_offset[0], this.minor_cities[i][1]+this.text_offset[1]);
      this.context.shadowColor = "rgba(0,0,0,0)";
      this.context.shadowBlur = 0;
    }

    // draw motorways
    for (let i=0; i<this.motorways.length; i++) {
      this.context.strokeStyle = this.color_motorway_main;
      this.context.lineWidth = this.motorway_line_width;
      this.context.beginPath();
      this.context.moveTo(this.motorways[i][0][0], this.motorways[i][0][1]);

      // connect cirlce plot points
      for (let j=1; j<this.motorways[i].length; j++) {
        this.context.lineTo(this.motorways[i][j][0], this.motorways[i][j][1]);
        this.context.stroke();
      }
    }
  }

  draw() {
    if (this.debug_mode) {
      this.draw_debug();
    }

    // fill background
    this.context.fillStyle = this.color_sea_blue;
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
    this.context.fillStyle = this.color_land_green;
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
      point(this.guide_points[i][0], this.guide_points[i][1], 2, this.context);
    }

    // draw circle center
    point(this.circle_center_coord[0], this.circle_center_coord[1], 2, this.context);
  }
}
