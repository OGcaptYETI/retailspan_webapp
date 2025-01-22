// src/app/components/KonvaComponents.tsx
import dynamic from 'next/dynamic';

export const Stage = dynamic(() => import('react-konva').then(mod => mod.Stage), {
  ssr: false,
  loading: () => <div>Loading stage...</div>,
});

export const Layer = dynamic(() => import('react-konva').then(mod => mod.Layer), {
  ssr: false,
});

export const Rect = dynamic(() => import('react-konva').then(mod => mod.Rect), {
  ssr: false,
});

export const Text = dynamic(() => import('react-konva').then(mod => mod.Text), {
  ssr: false,
});

export const Group = dynamic(() => import('react-konva').then(mod => mod.Group), {
  ssr: false,
});