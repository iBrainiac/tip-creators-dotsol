import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol';
import { UI_CONFIG } from '@/constants/bonk-config';
import { formatBonkAmount, calculateBonkReward } from '@/utils/bonk-utils';

// Mock data for vibe score
const mockVibeData = {
  totalPoints: 1250,
  totalBonkEarned: 125,
  level: 8,
  rank: 'Gold',
  recentActivities: [
    {
      id: '1',
      type: 'tip',
      amount: 1000,
      creator: 'CryptoArtist',
      timestamp: '2 hours ago',
      points: 15,
    },
    {
      id: '2',
      type: 'upvote',
      creator: 'SolanaDev',
      timestamp: '4 hours ago',
      points: 1,
    },
    {
      id: '3',
      type: 'tip',
      amount: 500,
      creator: 'BONKMaster',
      timestamp: '1 day ago',
      points: 10,
    },
    {
      id: '4',
      type: 'upvote',
      creator: 'Web3Creator',
      timestamp: '2 days ago',
      points: 1,
    },
  ],
  achievements: [
    {
      id: '1',
      title: 'First Tip',
      description: 'Sent your first BONK tip',
      icon: 'heart.fill',
      unlocked: true,
    },
    {
      id: '2',
      title: 'Generous Tipper',
      description: 'Tipped over 10K BONK',
      icon: 'star.fill',
      unlocked: true,
    },
    {
      id: '3',
      title: 'Community Curator',
      description: 'Upvoted 50 posts',
      icon: 'hand.thumbsup.fill',
      unlocked: false,
    },
    {
      id: '4',
      title: 'BONK Whale',
      description: 'Tipped over 100K BONK',
      icon: 'crown.fill',
      unlocked: false,
    },
  ],
};

interface ActivityItemProps {
  activity: typeof mockVibeData.recentActivities[0];
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'tip':
        return 'heart.fill';
      case 'upvote':
        return 'hand.thumbsup.fill';
      default:
        return 'circle.fill';
    }
  };

  const getActivityText = () => {
    switch (activity.type) {
      case 'tip':
        return `Tipped ${formatBonkAmount(activity.amount)} to ${activity.creator}`;
      case 'upvote':
        return `Upvoted ${activity.creator}'s post`;
      default:
        return 'Activity';
    }
  };

  return (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <UiIconSymbol 
          name={getActivityIcon()} 
          size={20} 
          color={activity.type === 'tip' ? UI_CONFIG.COLORS.PRIMARY : UI_CONFIG.COLORS.SUCCESS} 
        />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityText}>{getActivityText()}</Text>
        <Text style={styles.activityTime}>{activity.timestamp}</Text>
      </View>
      <View style={styles.activityPoints}>
        <Text style={styles.pointsText}>+{activity.points}</Text>
      </View>
    </View>
  );
};

interface AchievementItemProps {
  achievement: typeof mockVibeData.achievements[0];
}

const AchievementItem: React.FC<AchievementItemProps> = ({ achievement }) => {
  return (
    <View style={[styles.achievementItem, !achievement.unlocked && styles.achievementLocked]}>
      <View style={[styles.achievementIcon, !achievement.unlocked && styles.achievementIconLocked]}>
        <UiIconSymbol 
          name={achievement.icon} 
          size={24} 
          color={achievement.unlocked ? UI_CONFIG.COLORS.SECONDARY : '#999'} 
        />
      </View>
      <View style={styles.achievementContent}>
        <Text style={[styles.achievementTitle, !achievement.unlocked && styles.achievementTitleLocked]}>
          {achievement.title}
        </Text>
        <Text style={[styles.achievementDescription, !achievement.unlocked && styles.achievementDescriptionLocked]}>
          {achievement.description}
        </Text>
      </View>
      {achievement.unlocked && (
        <UiIconSymbol name="checkmark.circle.fill" size={20} color={UI_CONFIG.COLORS.SUCCESS} />
      )}
    </View>
  );
};

export default function VibeScoreScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'activities' | 'achievements'>('overview');

  const nextReward = calculateBonkReward(mockVibeData.totalPoints + 10) - mockVibeData.totalBonkEarned;

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      {/* Main Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{mockVibeData.totalPoints.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Points</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{formatBonkAmount(mockVibeData.totalBonkEarned)}</Text>
          <Text style={styles.statLabel}>BONK Earned</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>Level {mockVibeData.level}</Text>
          <Text style={styles.statLabel}>Current Level</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{mockVibeData.rank}</Text>
          <Text style={styles.statLabel}>Rank</Text>
        </View>
      </View>

      {/* Progress to Next Reward */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Next BONK Reward</Text>
          <Text style={styles.progressValue}>{formatBonkAmount(nextReward)}</Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(mockVibeData.totalPoints % 10) * 10}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {10 - (mockVibeData.totalPoints % 10)} more points needed
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/home')}
        >
          <UiIconSymbol name="heart.fill" size={24} color={UI_CONFIG.COLORS.PRIMARY} />
          <Text style={styles.actionText}>Tip Creators</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/leaderboard')}
        >
          <UiIconSymbol name="trophy.fill" size={24} color={UI_CONFIG.COLORS.SECONDARY} />
          <Text style={styles.actionText}>View Leaderboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderActivities = () => (
    <FlatList
      data={mockVibeData.recentActivities}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ActivityItem activity={item} />}
      contentContainerStyle={styles.activitiesList}
      showsVerticalScrollIndicator={false}
    />
  );

  const renderAchievements = () => (
    <FlatList
      data={mockVibeData.achievements}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <AchievementItem achievement={item} />}
      contentContainerStyle={styles.achievementsList}
      showsVerticalScrollIndicator={false}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vibe Score</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <UiIconSymbol name="gearshape.fill" size={24} color={UI_CONFIG.COLORS.PRIMARY} />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {(['overview', 'activities', 'achievements'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabActive]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'overview' && renderOverview()}
        {selectedTab === 'activities' && renderActivities()}
        {selectedTab === 'achievements' && renderAchievements()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_CONFIG.COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: UI_CONFIG.SPACING.LG,
    paddingVertical: UI_CONFIG.SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.PRIMARY,
  },
  settingsButton: {
    padding: UI_CONFIG.SPACING.SM,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: UI_CONFIG.SPACING.LG,
    paddingVertical: UI_CONFIG.SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    flex: 1,
    paddingVertical: UI_CONFIG.SPACING.SM,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: UI_CONFIG.COLORS.TEXT,
  },
  tabTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  overviewContainer: {
    padding: UI_CONFIG.SPACING.LG,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: UI_CONFIG.SPACING.MD,
    marginBottom: UI_CONFIG.SPACING.LG,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: UI_CONFIG.SPACING.LG,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.PRIMARY,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: UI_CONFIG.SPACING.LG,
    marginBottom: UI_CONFIG.SPACING.LG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: UI_CONFIG.SPACING.MD,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: UI_CONFIG.COLORS.TEXT,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.PRIMARY,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderRadius: 4,
    marginBottom: UI_CONFIG.SPACING.SM,
  },
  progressFill: {
    height: '100%',
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    gap: UI_CONFIG.SPACING.MD,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: UI_CONFIG.SPACING.LG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionText: {
    marginLeft: UI_CONFIG.SPACING.SM,
    fontSize: 14,
    fontWeight: '600',
    color: UI_CONFIG.COLORS.TEXT,
  },
  activitiesList: {
    padding: UI_CONFIG.SPACING.LG,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: UI_CONFIG.SPACING.LG,
    marginBottom: UI_CONFIG.SPACING.MD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: UI_CONFIG.SPACING.MD,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '600',
    color: UI_CONFIG.COLORS.TEXT,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  activityPoints: {
    backgroundColor: UI_CONFIG.COLORS.PRIMARY,
    borderRadius: 12,
    paddingHorizontal: UI_CONFIG.SPACING.MD,
    paddingVertical: UI_CONFIG.SPACING.SM,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  achievementsList: {
    padding: UI_CONFIG.SPACING.LG,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: UI_CONFIG.SPACING.LG,
    marginBottom: UI_CONFIG.SPACING.MD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF9E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: UI_CONFIG.SPACING.MD,
  },
  achievementIconLocked: {
    backgroundColor: '#F5F5F5',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT,
    marginBottom: 2,
  },
  achievementTitleLocked: {
    color: '#999',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
  },
  achievementDescriptionLocked: {
    color: '#999',
  },
}); 