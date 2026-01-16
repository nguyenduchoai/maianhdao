'use client';

import { useEffect, useState } from 'react';

interface Petal {
    id: number;
    left: number;
    delay: number;
    duration: number;
    size: number;
}

export function CherryBlossomPetals() {
    const [petals, setPetals] = useState<Petal[]>([]);

    useEffect(() => {
        const newPetals: Petal[] = [];
        for (let i = 0; i < 20; i++) {
            newPetals.push({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 10,
                duration: 8 + Math.random() * 8,
                size: 8 + Math.random() * 8,
            });
        }
        setPetals(newPetals);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {petals.map((petal) => (
                <div
                    key={petal.id}
                    className="petal"
                    style={{
                        left: `${petal.left}%`,
                        width: `${petal.size}px`,
                        height: `${petal.size}px`,
                        animationDelay: `${petal.delay}s`,
                        animationDuration: `${petal.duration}s`,
                    }}
                />
            ))}
        </div>
    );
}
