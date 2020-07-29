class Boid  {                   // Object
    constructor()   {           // Constructor is a function which gives an object initial values
        this.position = createVector(random(width), random(height));    // Random vector with the boid's initial coordinates
        
        this.velocity = p5.Vector.random2D();                           // Random velocity direction
        this.speed = 4;                                                 // Velocity magnitude
        this.velocity.setMag(this.speed);                    
        
        this.acceleration = createVector();

        this.maxForce = 1;      // So that they don't move too fast
        this.perception = 50;  // Radius of what they can see 
    }


    Borders() {     // Watch for borders
        if(this.position.x > width) 
            this.position.x = 0;
        else if(this.position.x < 0)
            this.position.x = width;

        if(this.position.y > height) 
            this.position.y = 0;
        else if(this.position.y < 0)
            this.position.y = height;
    }
    
    
    AlignCohesionSeparation(boids, mode)    {       // Align with other boids, stay grouped and avoid colliding
        let steering = createVector();
        let total = 0;

        for(let boid of boids) {
            let d = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
            
            if(boid != this && d < this.perception)  {
                if(mode == "align") 
                    steering.add(boid.velocity);    // Sum all the velocity vector of the other boids

                else if(mode == "cohesion")          
                    steering.add(boid.position);    // Sum all the positional vector of the other boids
                
                else if (mode == "separation" && d>0)  {
                    let diff = p5.Vector.sub(this.position, boid.position); // Difference in x and y between me and another boid

                    diff.div(d / 2);                                        // The farther it is, the lower the magnitude (/ 2 just to increase the force)
                    steering.add(diff);                                     // Add all these vectors
                }
                
                total++;
            }
        }

        if(total > 0)   {
            steering.div(total);                // Average it

            if(mode == "cohesion")
                steering.sub(this.position);    // This gives a vector which will "push" the boid
            
            steering.setMag(this.speed);        // Set a speed, otherwise it will eventually fall to 0
            steering.sub(this.velocity);        // This gives a vector which will "push" the boid
            steering.limit(this.maxForce);      // Limit the vector to its maximum value
        }   

        return steering; 
    }


    Flock(boids)    {
        let alignment = this.AlignCohesionSeparation(boids, "align");       // Alignment force I want to apply on the boid
        let cohesion = this.AlignCohesionSeparation(boids, "cohesion");     // Cohesion force I want to apply on the boid
        let separation = this.AlignCohesionSeparation(boids, "separation"); // Separation force I want to apply on the boid

        this.acceleration.add(alignment);        // Mass = 1, F = a
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }


    Update()    {                            // Update the boid's caracteristics
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.speed);

        this.acceleration.mult(0);          // Zero the acceleration so that it doesn't add over and over
    }


    Show()  {                                       
        strokeWeight(8);                            // How thick (big) is the boid
        stroke(255);                                // Greyscale value
        point(this.position.x, this.position.y);    // Draw boid
    }
}