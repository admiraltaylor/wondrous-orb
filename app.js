/**
 * Created by Taylor on 2/8/2017.
 */
function init() {

    var width   = window.innerWidth,
        height  = window.innerHeight,
        ratio   = width / height;

    // set up the scene and camera
    scene       = new THREE.Scene();
    camera      = new THREE.PerspectiveCamera(
        75,       // camera angle,
        ratio,    // viewport ratio
        1,        // near plane, and far plane below
        1000);

    // create a renderer with antialiasing on
    renderer    = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(width, height);

    // now add the camera to the scene
    // and the WebGL context to the DOM
    scene.add(camera);
    document.body.appendChild(renderer.domElement);

    // do everything else
    createObjects();
    //createSprings();
    //bindCallbacks();
    //displaceRandomFace();
    requestAnimationFrame(animate);
    function animate() {

        // render
        renderer.render(scene, camera);

        // schedule the next run
        requestAnimationFrame(animate);
    }

}

/**
 * Creates the sphere and the plain (floor) geometries
 */
function createObjects() {

    // first create the environment map
    var path = "envmap/",
        format = '.jpg',
        urls = [
            path + 'posx' + format, path + 'negx' + format,
            path + 'posy' + format, path + 'negy' + format,
            path + 'posz' + format, path + 'negz' + format
        ],
        textureCube = THREE.ImageUtils.loadTextureCube(urls);

    // create the sphere geometry, based
    // on the Octahedron primitive (since it has no seams)
    sphereGeometry = new THREE.SphereGeometry(
        200,      // radius
        60,       // resolution x
        30);      // resolution y

    sphereMaterial = new THREE.MeshLambertMaterial({
        color     : 0xEEEEEE,
        envMap    : textureCube,
        shininess : 200,
        shading   : THREE.SmoothShading});

    // now create the sphere and then
    // declare its geometry to be dynamic
    // so we can update it later on
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.geometry.dynamic = true;

    // distance the sphere from the ground
    // a little bit
    sphere.position.y = 100;
    scene.add(sphere);

    // create the floor
    planeGeometry = new THREE.PlaneGeometry( 400, 400, 1 );
    planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        map: THREE.ImageUtils.loadTexture("floor.png"),
        transparent: true
    });

    plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // position the floor down a little
    // and rotate it to be perpendicular
    // to the centre of the sphere
    plane.rotation.x = Math.PI * -0.5;
    plane.position.y = -150;
    scene.add(plane);

    // create a light which
    // we can position to the front
    lightFront = new THREE.PointLight(0xFFFFFF, 1.5);
    lightFront.position.y = 400;
    scene.add(lightFront);

    // and another from the bottom
    lightBottom = new THREE.DirectionalLight(0xFFFFFF, 1.3);
    lightBottom.position.y = -240;
    scene.add(lightBottom);

}
init();
