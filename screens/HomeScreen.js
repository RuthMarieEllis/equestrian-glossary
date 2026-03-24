import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { categories } from '../data/glossary';

const COLORS = {
  navy:         '#1B2A4A',
  hunterGreen:  '#355E3B',
  maroon:       '#800020',
  brown:        '#5C3D1E',
  gold:         '#C9A96E',
  goldDark:     '#A07840',
  background:   '#F4EFE6',
  card:         '#FFFFFF',
  border:       '#D8CEBC',
  text:         '#1C1008',
  textMedium:   '#3D2B1F',
  textLight:    '#7A6555',
  divider:      '#C9A96E',
};

const NUM_COLUMNS = 2;
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = 8;
const CARD_WIDTH =
  (SCREEN_WIDTH - CARD_MARGIN * 2 - CARD_MARGIN * 2 * NUM_COLUMNS) /
  NUM_COLUMNS;

export default function HomeScreen({ navigation }) {
  const [searchText, setSearchText] = useState('');

  const searchResults = useMemo(() => {
    if (!searchText.trim()) return [];
    const query = searchText.trim().toLowerCase();
    const results = [];
    for (const category of categories) {
      for (const item of category.terms) {
        if (
          item.term.toLowerCase().includes(query) ||
          item.definition.toLowerCase().includes(query)
        ) {
          results.push({
            term: item.term,
            definition: item.definition,
            categoryId: category.id,
            categoryName: category.name,
            categoryColor: category.color,
            categoryIcon: category.icon,
          });
        }
      }
    }
    return results;
  }, [searchText]);

  const isSearching = searchText.trim().length > 0;

  function renderCategoryCard({ item }) {
    return (
      <TouchableOpacity
        style={[styles.categoryCard, { borderLeftColor: item.color }]}
        onPress={() =>
          navigation.navigate('Category', {
            id: item.id,
            name: item.name,
            terms: item.terms,
            color: item.color,
            icon: item.icon,
          })
        }
        activeOpacity={0.75}
      >
        <View style={[styles.categoryIconBadge, { backgroundColor: item.color }]}>
          <Text style={styles.categoryIcon}>{item.icon}</Text>
        </View>
        <Text style={styles.categoryName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.categoryCount}>
          {item.terms.length} {item.terms.length === 1 ? 'term' : 'terms'}
        </Text>
      </TouchableOpacity>
    );
  }

  function renderSearchResult({ item }) {
    return (
      <View style={[styles.searchResultCard, { borderLeftColor: item.categoryColor }]}>
        <View style={styles.searchResultHeader}>
          <Text style={styles.searchResultTerm}>{item.term}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: item.categoryColor }]}>
            <Text style={styles.categoryBadgeText}>
              {item.categoryIcon}  {item.categoryName}
            </Text>
          </View>
        </View>
        <View style={styles.searchResultDivider} />
        <Text style={styles.searchResultDefinition}>{item.definition}</Text>
      </View>
    );
  }

  function renderHeader() {
    return (
      <View style={styles.headerArea}>
        {/* Decorative title band */}
        <View style={styles.titleBand}>
          <View style={styles.ornamentRow}>
            <View style={styles.ornamentLine} />
            <Text style={styles.ornamentGlyph}>✦</Text>
            <View style={styles.ornamentLine} />
          </View>
          <Text style={styles.subtitle}>
            Your guide to horse world terminology
          </Text>
          <View style={styles.ornamentRow}>
            <View style={styles.ornamentLine} />
            <Text style={styles.ornamentGlyph}>✦</Text>
            <View style={styles.ornamentLine} />
          </View>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search terms or definitions…"
            placeholderTextColor={COLORS.textLight}
            value={searchText}
            onChangeText={setSearchText}
            clearButtonMode="while-editing"
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {!isSearching && (
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionLabel}>BROWSE BY CATEGORY</Text>
            <View style={styles.sectionLabelLine} />
          </View>
        )}
      </View>
    );
  }

  if (isSearching) {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) =>
            item.categoryId + '-' + item.term + '-' + index
          }
          renderItem={renderSearchResult}
          ListHeaderComponent={
            <View>
              {renderHeader()}
              {searchResults.length === 0 ? (
                <View style={styles.emptySearch}>
                  <Text style={styles.emptySearchIcon}>🐴</Text>
                  <Text style={styles.emptySearchTitle}>No results found</Text>
                  <Text style={styles.emptySearchSub}>
                    Try a different word or browse the categories
                  </Text>
                </View>
              ) : (
                <Text style={styles.resultsCount}>
                  {searchResults.length}{' '}
                  {searchResults.length === 1 ? 'result' : 'results'} for
                  &ldquo;{searchText.trim()}&rdquo;
                </Text>
              )}
            </View>
          }
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoryCard}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
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
  headerArea: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  titleBand: {
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  ornamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 6,
  },
  ornamentLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gold,
    opacity: 0.7,
  },
  ornamentGlyph: {
    color: COLORS.gold,
    fontSize: 13,
    marginHorizontal: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    fontStyle: 'italic',
    letterSpacing: 0.4,
    textAlign: 'center',
    lineHeight: 20,
    marginVertical: 2,
  },

  /* ── Search bar ── */
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.navy,
    paddingHorizontal: 14,
    paddingVertical: 11,
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 0,
    letterSpacing: 0.2,
  },
  clearButton: {
    fontSize: 13,
    color: COLORS.textLight,
    paddingLeft: 8,
  },

  /* ── Section label ── */
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.goldDark,
    letterSpacing: 1.6,
    marginRight: 10,
  },
  sectionLabelLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },

  /* ── Category cards ── */
  columnWrapper: {
    paddingHorizontal: CARD_MARGIN,
  },
  categoryCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    margin: CARD_MARGIN,
    padding: 14,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  categoryIcon: {
    fontSize: 21,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 5,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  categoryCount: {
    fontSize: 12,
    color: COLORS.goldDark,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  /* ── Search results ── */
  searchResultCard: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 10,
    padding: 16,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  searchResultHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 6,
  },
  searchResultTerm: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    flexShrink: 1,
    marginRight: 8,
    letterSpacing: 0.2,
  },
  categoryBadge: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 4,
    flexShrink: 0,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  searchResultDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 10,
  },
  searchResultDefinition: {
    fontSize: 14,
    color: COLORS.textMedium,
    lineHeight: 22,
  },
  resultsCount: {
    fontSize: 12,
    color: COLORS.textLight,
    paddingHorizontal: 16,
    paddingBottom: 4,
    fontStyle: 'italic',
    letterSpacing: 0.2,
  },

  /* ── Empty search ── */
  emptySearch: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptySearchIcon: {
    fontSize: 48,
    marginBottom: 14,
  },
  emptySearchTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  emptySearchSub: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 21,
  },
});
