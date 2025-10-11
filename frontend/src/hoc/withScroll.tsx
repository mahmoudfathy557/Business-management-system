// src/hoc/withScroll.tsx
import React from 'react';
import ScrollableScreen from '../components/ScrollableScreen';

export const withScroll = (Component: React.ComponentType<any>) => (props: any) => (
    <ScrollableScreen>
        <Component {...props} />
    </ScrollableScreen>
);
