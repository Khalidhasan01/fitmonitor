package com.fitmonitor.profile.entity

import com.fitmonitor.auth.entity.UserEntity
import jakarta.persistence.*

@Entity
@Table(name = "user_profiles")
class UserProfileEntity(
    @Id
    var id: String = "",

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    var user: UserEntity = UserEntity(),

    var age: Int = 28,
    var height: Double = 178.0,
    var weight: Double = 76.5,
    var goalWeight: Double? = 72.0,
    var dailyStepGoal: Int = 10000,
    var dailyCalorieGoal: Int = 2200,
    var waterGoal: Int = 8,
    var sleepGoal: Int = 8,
    var avatarUrl: String? = null,
    var unitSystem: String = "metric",
    var activityLevel: String = "moderate",
    var timezone: String = "UTC",
    var bio: String = "",

    @Column(length = 2000)
    var goalsJson: String = """{"macros":{"protein":150,"carbs":250,"fat":65},"targetDate":null,"targetWeight":72,"bodyFatPercent":null,"restingHR":null,"workoutsPerWeek":5,"history":[]}""",

    @Column(length = 2000)
    var notificationPrefsJson: String = """{}""",

    @Column(length = 2000)
    var privacySettingsJson: String = """{"showOnLeaderboard":true,"sharedMetrics":["steps","workouts"],"allowFriendRequests":true,"blockedUsers":[],"activeSessions":[]}""",

    @Column(length = 2000)
    var connectedDevicesJson: String = """[]""",

    @Column(length = 1000)
    var appearanceJson: String = """{"theme":"smart","accentColor":"green","density":"comfortable","widgetOrder":["steps","calories","heart","sleep","water","weight","meals","workouts"]}"""
)
