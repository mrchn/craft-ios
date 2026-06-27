// @/components/haptics (pdfcraft-mobile)

import * as Haptics from 'expo-haptics';

const STYLES = {
	light: Haptics.ImpactFeedbackStyle.Light,
	medium: Haptics.ImpactFeedbackStyle.Medium,
	heavy: Haptics.ImpactFeedbackStyle.Heavy,
	soft: Haptics.ImpactFeedbackStyle.Soft,
	rigid: Haptics.ImpactFeedbackStyle.Rigid
};

export const hapticTap = (style: keyof typeof STYLES = 'rigid') => {
	Haptics.impactAsync(STYLES[style])
}