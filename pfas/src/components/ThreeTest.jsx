import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import moleculesData from '../data/molecules.json'; // Import JSON file
import * as TWEEN from '@tweenjs/tween.js';

const ThreeTest = () => {
    const canvasRef = useRef(null);
    const moleculeGroupsRef = useRef([]); // Ref to hold references to each molecule group
    const startTimeRef = useRef(null);
    let initialDistance;
    const [moleculeMove, setMoleculeMove] = useState(false);
    useEffect(() => {
        const canvas = canvasRef.current;
        const renderer = new THREE.WebGLRenderer({ canvas });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xffffff); // Set background color to white

        // Create a scene
        const scene = new THREE.Scene();

        // Create a camera
        const camera = new THREE.PerspectiveCamera(100, canvas.width / canvas.height, 0.01, 100);
        camera.position.z = 8; // Adjusted camera position for better view

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Set ambient light color to white
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 10, 1); // Adjust light position
        scene.add(ambientLight, directionalLight);

        // Create molecules dynamically from JSON data
        moleculesData.forEach((moleculeData, index) => {
            const moleculeGroup = new THREE.Group(); // Create a group for the molecule

            const offset = new THREE.Vector3().fromArray(moleculeData.offset);

            // Create atoms for the molecule
            moleculeData.atoms.forEach(atom => {
                const position = new THREE.Vector3().fromArray(atom.position).add(offset);
                const color = parseInt(atom.color, 16);
                const atomMesh = new THREE.Mesh(new THREE.SphereGeometry(0.3, 30, 30), new THREE.MeshPhongMaterial({ color }));
                atomMesh.position.copy(position);
                moleculeGroup.add(atomMesh); // Add atom to the molecule group
            });

            // Create bonds for the molecule 
            moleculeData.bonds.forEach(bond => {
                const atom1 = moleculeGroup.children[bond.atom1];
                const atom2 = moleculeGroup.children[bond.atom2];
                const tubeGeometry = new THREE.TubeGeometry(new THREE.LineCurve3(atom1.position, atom2.position), 8, 0.1, 8, false);
                const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xA9A9A9 });
                const cylinderMesh = new THREE.Mesh(tubeGeometry, cylinderMaterial);
                moleculeGroup.add(cylinderMesh); // Add bond to the molecule group
            });

            moleculeGroup.position.copy(offset); // Set position of molecule group to offset
            scene.add(moleculeGroup); // Add molecule group to the scene
            moleculeGroupsRef.current[index] = moleculeGroup; // Store reference to the molecule group
        });

        const firstMolecule = moleculeGroupsRef.current[0];
        const secondMolecule = moleculeGroupsRef.current[1];
        initialDistance = Math.abs(firstMolecule.position.x - secondMolecule.position.x);

        // Store the start time
        startTimeRef.current = Date.now();

        // Create an animation loop for each molecule group
        const animate = () => {
            requestAnimationFrame(animate);
            const currentTime = Date.now() - startTimeRef.current;

            // Update the tweens
            TWEEN.update();

            moleculeGroupsRef.current.forEach(moleculeGroup => {
                moleculeGroup.rotation.x += 0.01; // Apply rotation to each molecule group
                moleculeGroup.rotation.y += 0; // Apply rotation to each molecule group
                moleculeGroup.rotation.z += 0;
            });
            renderer.render(scene, camera);
        };

        animate();
        
        // Set a timer to execute myFunction after 2000 milliseconds
        const timerId = setTimeout(() => {
            const initialDistance = Math.abs(moleculeGroupsRef.current[0].position.x - moleculeGroupsRef.current[1].position.x );

            // First Tween
            const position1 = moleculeGroupsRef.current[0].position.clone(); // Create a copy of position
            const target1 = { x: initialDistance / 2 };
            const tween1 = new TWEEN.Tween(position1).to(target1, 2000);
            tween1.easing(TWEEN.Easing.Exponential.EaseIn);
            tween1.onUpdate(function () {
                moleculeGroupsRef.current[0].position.copy(position1);
            });
            tween1.start();

            // Second Tween
            const position2 = moleculeGroupsRef.current[1].position.clone(); // Create a copy of position
            const target2 = { x: -initialDistance / 2 , z: -0.5};
            const tween2 = new TWEEN.Tween(position2).to(target2, 2000);
            tween2.easing(TWEEN.Easing.Exponential.EaseIn);
            tween2.onUpdate(function () {
                moleculeGroupsRef.current[1].position.copy(position2);
            });
            tween2.start();

            console.log('init dist', initialDistance);
            setTimeout(() => {
                const atomToMove = moleculeGroupsRef.current[0].children[2]; // Atom from the first molecule
                moleculeGroupsRef.current[0].remove(atomToMove); // First molecule's atom removal
                    const bond = moleculeGroupsRef.current[0].children[8];
                    // moleculeGroupsRef.current[0].remove(bond);
                const atomToMove2 = moleculeGroupsRef.current[1].children[2]; // Atom from the second molecule 
                moleculeGroupsRef.current[1].remove(atomToMove2); // Second molecule's atom removal
                
                const tempPos = Object.assign({}, atomToMove2.position); // Copy of Second molecule's atom position 
                atomToMove2.position.set(atomToMove.position.x, atomToMove.position.y, atomToMove.position.z); // Second molecule's atom position modification
                moleculeGroupsRef.current[0].add(atomToMove2); // Second molecule's atom added to first molecule
                atomToMove.position.set(tempPos.x, tempPos.y, tempPos.z); //First molecule's atom position modification
                moleculeGroupsRef.current[1].add(atomToMove); // First molecule's atom added to second molecule
                moleculeGroupsRef.current[1].remove(moleculeGroupsRef.current[1].children[0])
                moleculeGroupsRef.current[1].remove(moleculeGroupsRef.current[1].children[1])
                moleculeGroupsRef.current[1].children[0].material.color.set(0xffffff)
                console.log("kk", moleculeGroupsRef.current[1].children[0] )
                moleculeGroupsRef.current[0].children[14].material.color.set(0xff0000)

                
                
                const position = new THREE.Vector3(moleculeGroupsRef.current[0].children[14].position.x - 0.5, moleculeGroupsRef.current[0].children[14].position.y +0.5, moleculeGroupsRef.current[0].children[14].position.z+0.5);
                const atomMesh = new THREE.Mesh(new THREE.SphereGeometry(0.3, 30, 30));
                
                atomMesh.position.copy(position);
                moleculeGroupsRef.current[0].add(atomMesh);
                moleculeGroupsRef.current[0].children[15].material.color.set(0xA020F0)

                const tubeGeometry = new THREE.TubeGeometry(new THREE.LineCurve3(moleculeGroupsRef.current[0].children[15].position, moleculeGroupsRef.current[0].children[14].position), 8, 0.1, 8, false);
                const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x9DA3A7 });
                const cylinderMesh = new THREE.Mesh(tubeGeometry, cylinderMaterial);
                moleculeGroupsRef.current[0].add(cylinderMesh); // Add bond to the molecule group
                
                
                // atom added


                // const positionA = [1, 1, 1.0000]; 
                // const position = new THREE.Vector3().fromArray(positionA);
                // const Color =  "A020F0";
                // const color = parseInt(Color, 16);
                // const atomMesh = new THREE.Mesh(new THREE.SphereGeometry(0.3, 30, 30), new THREE.MeshPhongMaterial({ color }));
                // atomMesh.position.copy(position);
                // moleculeGroupsRef.current[0].add(atomMesh);
               
                // const atomToMove = moleculeGroupsRef.current[1].children[0];
                // const atomToMove1 = moleculeGroupsRef.current[1].children[1];
                // const bond = moleculeGroupsRef.current[1].children[3];
                // const bond1 = moleculeGroupsRef.current[1].children[4];
                // moleculeGroupsRef.current[1].remove(atomToMove);
                // moleculeGroupsRef.current[1].remove(atomToMove1);
                // moleculeGroupsRef.current[1].remove(bond);
                // // moleculeGroupsRef.current[1].remove(bond1);
               
                // moleculeGroupsRef.current[0].add(atomToMove);
             
                // const atomToMove2 = moleculeGroupsRef.current[0].children[2];
                // moleculeGroupsRef.current[0].remove(atomToMove2);
                // atomToMove2.position.set( atomToMove.position.x, atomToMove.position.y , atomToMove.position.z );


            }, 2000);

          }, 1000);

        // Cleanup function to clear the timer when the component unmounts
        return () => {
            clearTimeout(timerId);
            // Cleanup
            scene.children.forEach(child => {
                if (child instanceof THREE.Group) {
                    scene.remove(child); // Remove each molecule group from the scene
                }
            });
        };
    }, []);

    return <canvas ref={canvasRef} />;
};

export default ThreeTest;

