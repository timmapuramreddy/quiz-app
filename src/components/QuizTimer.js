import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Circle, Text as SvgText, G } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CIRCLE_RADIUS = width * 0.15;

export default function QuizTimer({ timeLeft, totalTime }) {
  const circumference = 2 * Math.PI * CIRCLE_RADIUS;
  const progressValue = (timeLeft / totalTime) * circumference;

  return (
    <View>
      <Svg height={width * 0.35} width={width}>
        <G>
          <Circle
            cx={width / 2}
            cy={width * 0.175}
            r={CIRCLE_RADIUS}
            stroke="#E0E0E0"
            strokeWidth={10}
            fill="none"
          />
          <Circle
            cx={width / 2}
            cy={width * 0.175}
            r={CIRCLE_RADIUS}
            stroke="#4CAF50"
            strokeWidth={10}
            fill="none"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={`${circumference - progressValue}`}
            strokeLinecap="round"
            transform={`rotate(-90, ${width / 2}, ${width * 0.175})`}
          />
        </G>
        <G>
          <SvgText
            x={`${width / 2}`}
            y={`${width * 0.175}`}
            fontSize="24"
            fill="#333"
            textAnchor="middle"
            alignmentBaseline="central"
          >
            {`${timeLeft}`}
          </SvgText>
        </G>
      </Svg>
    </View>
  );
}