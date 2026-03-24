import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const COLORS = {
  navy:        '#1B2A4A',
  gold:        '#C9A96E',
  goldDark:    '#A07840',
  background:  '#F4EFE6',
  card:        '#FFFFFF',
  cardExpanded:'#FDFAF5',
  border:      '#D8CEBC',
  text:        '#1C1008',
  textMedium:  '#3D2B1F',
  textLight:   '#7A6555',
};

export default function CategoryScreen({ route }) {
  const { name, terms, color, icon } = route.params;
  const [expandedTerms, setExpandedTerms] = useState({});

  function toggleTerm(term) {
    setExpandedTerms((prev) => ({
      ...prev,
      [term]: !prev[term],
    }));
  }

  function renderTermCard({ item, index }) {
    const isExpanded = !!expandedTerms[item.term];
    return (
      <Pressable
        style={({ pressed }) => [
          styles.termCard,
          isExpanded && [styles.termCardExpanded, { borderLeftColor: color }],
          pressed && styles.termCardPressed,
        ]}
        onPress={() => toggleTerm(item.term)}
        accessibilityRole="button"
        accessibilityLabel={item.term}
        accessibilityHint={
          isExpanded ? 'Tap to collapse definition' : 'Tap to expand definition'
        }
      >
        <View style={styles.termRow}>
          <Text style={[styles.termIndex, { color: color }]}>
            {String(index + 1).padStart(2, '0')}
          </Text>
          <View style={styles.termDot} />
          <Text style={styles.termName}>{item.term}</Text>
          <Text style={[styles.chevron, isExpanded && styles.chevronOpen, { color }]}>
            ›
          </Text>
        </View>

        {isExpanded && (
          <View style={styles.definitionWrapper}>
            <View style={[styles.definitionAccent, { backgroundColor: color }]} />
            <View style={styles.definitionContent}>
              <Text style={styles.definitionText}>{item.definition}</Text>
            </View>
          </View>
        )}
      </Pressable>
    );
  }

  function renderListHeader() {
    return (
      <View style={styles.headerWrapper}>
        {/* Rich colored banner */}
        <View style={[styles.categoryBanner, { backgroundColor: color }]}>
          <Text style={styles.bannerIcon}>{icon}</Text>
          <View style={styles.bannerTextArea}>
            <Text style={styles.bannerName}>{name}</Text>
            <Text style={styles.bannerCount}>
              {terms.length} {terms.length === 1 ? 'term' : 'terms'}
            </Text>
          </View>
        </View>

        {/* Gold decorative stripe below banner */}
        <View style={styles.bannerGoldStripe} />

        {/* Hint text */}
        <Text style={styles.hintText}>Tap any term to reveal its definition</Text>

        <View style={styles.termListDivider} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={terms}
        keyExtractor={(item, index) => item.term + '-' + index}
        renderItem={renderTermCard}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={<View style={styles.listFooter} />}
        contentContainerStyle={styles.listContent}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={10}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: 40,
  },

  /* ── Header ── */
  headerWrapper: {
    marginBottom: 8,
  },
  categoryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  bannerIcon: {
    fontSize: 38,
    marginRight: 16,
  },
  bannerTextArea: {
    flex: 1,
  },
  bannerName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    lineHeight: 26,
  },
  bannerCount: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.80)',
    marginTop: 3,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  bannerGoldStripe: {
    height: 3,
    backgroundColor: COLORS.gold,
    opacity: 0.85,
  },
  hintText: {
    fontSize: 12,
    color: COLORS.textLight,
    fontStyle: 'italic',
    letterSpacing: 0.2,
    textAlign: 'center',
    paddingTop: 14,
    paddingBottom: 4,
  },
  termListDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
  },

  /* ── Term cards ── */
  termCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginBottom: 7,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  termCardExpanded: {
    backgroundColor: COLORS.cardExpanded,
    borderLeftWidth: 4,
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
  },
  termCardPressed: {
    opacity: 0.82,
  },
  termRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  termIndex: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    width: 26,
    textAlign: 'right',
  },
  termDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: 9,
  },
  termName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 21,
    letterSpacing: 0.1,
  },
  chevron: {
    fontSize: 22,
    marginLeft: 6,
    transform: [{ rotate: '0deg' }],
  },
  chevronOpen: {
    transform: [{ rotate: '90deg' }],
  },

  /* ── Definition ── */
  definitionWrapper: {
    flexDirection: 'row',
    marginHorizontal: 14,
    marginBottom: 14,
    marginTop: 0,
  },
  definitionAccent: {
    width: 3,
    borderRadius: 2,
    marginRight: 12,
    opacity: 0.85,
  },
  definitionContent: {
    flex: 1,
  },
  definitionText: {
    fontSize: 14,
    color: COLORS.textMedium,
    lineHeight: 23,
    letterSpacing: 0.1,
  },

  listFooter: {
    height: 20,
  },
});
