import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol';
import { UI_CONFIG } from '@/constants/bonk-config';
import { useAuth, type UserRole } from '@/components/auth/auth-provider';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { setUserRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelection = async (role: UserRole) => {
    setSelectedRole(role);
    setIsLoading(true);

    try {
      await setUserRole(role);
      
      // Navigate based on role
      if (role === 'creator') {
        router.push('/(tabs)/home'); // TODO: Navigate to creator setup when created
      } else if (role === 'tipper') {
        router.push('/(tabs)/home'); // TODO: Navigate to tipper setup when created
      } else if (role === 'both') {
        router.push('/(tabs)/home'); // TODO: Navigate to combined setup when created
      }
    } catch (error) {
      console.error('Error setting user role:', error);
      setIsLoading(false);
    }
  };

  const roles = [
    {
      id: 'creator' as UserRole,
      title: 'I\'m a Creator',
      subtitle: 'Share your work and receive tips',
      icon: 'paintbrush' as const,
      color: '#FF6B6B',
      description: 'Upload content, build your audience, and earn from your creativity',
    },
    {
      id: 'tipper' as UserRole,
      title: 'I\'m a Tipper',
      subtitle: 'Discover and support creators',
      icon: 'heart' as const,
      color: '#4ECDC4',
      description: 'Browse content, find amazing creators, and show your support',
    },
    {
      id: 'both' as UserRole,
      title: 'I\'m Both',
      subtitle: 'Create content and support others',
      icon: 'person.2' as const,
      color: '#45B7D1',
      description: 'The best of both worlds - share your work and support fellow creators',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to SolCreator!</Text>
        <Text style={styles.subtitle}>How would you like to use the app?</Text>
      </View>

      <View style={styles.rolesContainer}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.id}
            style={[
              styles.roleCard,
              selectedRole === role.id && styles.roleCardSelected,
            ]}
            onPress={() => handleRoleSelection(role.id)}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <View style={[styles.roleIcon, { backgroundColor: role.color }]}>
              <UiIconSymbol name={role.icon} size={32} color="white" />
            </View>
            <View style={styles.roleContent}>
              <Text style={styles.roleTitle}>{role.title}</Text>
              <Text style={styles.roleSubtitle}>{role.subtitle}</Text>
              <Text style={styles.roleDescription}>{role.description}</Text>
            </View>
            {selectedRole === role.id && (
              <View style={styles.selectedIndicator}>
                <UiIconSymbol name="checkmark.circle.fill" size={24} color={role.color} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Setting up your profile...</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          You can change your role later in settings
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_CONFIG.COLORS.BACKGROUND,
  },
  header: {
    padding: UI_CONFIG.SPACING.XL,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT,
    marginBottom: UI_CONFIG.SPACING.SM,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  rolesContainer: {
    padding: UI_CONFIG.SPACING.LG,
    gap: UI_CONFIG.SPACING.MD,
  },
  roleCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: UI_CONFIG.SPACING.LG,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleCardSelected: {
    borderColor: UI_CONFIG.COLORS.PRIMARY,
    backgroundColor: '#FFF9F9',
  },
  roleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: UI_CONFIG.SPACING.MD,
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: UI_CONFIG.COLORS.TEXT,
    marginBottom: 4,
  },
  roleSubtitle: {
    fontSize: 14,
    color: UI_CONFIG.COLORS.PRIMARY,
    fontWeight: '600',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  selectedIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: UI_CONFIG.SPACING.SM,
  },
  loadingContainer: {
    padding: UI_CONFIG.SPACING.LG,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: UI_CONFIG.COLORS.TEXT,
  },
  footer: {
    padding: UI_CONFIG.SPACING.LG,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
}); 