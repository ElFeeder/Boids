const boids = [];

function setup()    {
    createCanvas(1200, 900);

    for(let i = 0; i < 200; i++)
        boids.push(new Boid());     // Create a new boid
}

function draw() {
    background(51);     // Greyscale value 

    for(let boid of boids)  {
        boid.Borders();
        boid.Flock(boids);

        boid.Update();
        boid.Show()
    }
}