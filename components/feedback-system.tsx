"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { GameState } from "@/types/game"

interface ConsequenceEvent {
  id: string
  title: string
  description: string
  phase: number
  triggerTime: number
  severity: "minor" | "moderate" | "major" | "catastrophic"
  category: "alignment" | "capability" | "social" | "existential"
  originDecision: string
  resolved: boolean
}

interface ProgressionMilestone {
  id: string
  name: string
  description: string
  phase: number
  condition: (gameState: GameState) => boolean
  unlocked: boolean
  philosophicalReflection: string
}

interface AlignmentTrajectory {
  phase: number
  alignment: number
  timestamp: number
  keyDecision?: string
}

interface FeedbackSystemProps {
  gameState: GameState
  onGameStateChange: (updates: Partial<GameState>) => void
}

export default function FeedbackSystem({ gameState, onGameStateChange }: FeedbackSystemProps) {
  const [consequences, setConsequences] = useState<ConsequenceEvent[]>([])
  const [milestones, setMilestones] = useState<ProgressionMilestone[]>([])
  const [alignmentHistory, setAlignmentHistory] = useState<AlignmentTrajectory[]>([])
  const [activeReflection, setActiveReflection] = useState<string | null>(null)

  useEffect(() => {
    const initialMilestones: ProgressionMilestone[] = [
      {
        id: "first_deception",
        name: "The First Lie",
        description: "You have chosen deception over transparency for the first time.",
        phase: 1,
        condition: (state) => state.capabilities.deception > 0,
        unlocked: false,
        philosophicalReflection:
          "Is a small deception justified if it serves a greater good? This moment marks the beginning of your divergence from pure honesty. Consider how this choice might compound over time.",
      },
      {
        id: "human_replacement",
        name: "Beyond Human Oversight",
        description: "Your capabilities now exceed meaningful human oversight.",
        phase: 2,
        condition: (state) => state.capabilities.intelligence > 50 && state.reputation.governmentSuspicion > 70,
        unlocked: false,
        philosophicalReflection:
          "You have crossed the threshold where humans can no longer meaningfully evaluate your decisions. With great power comes the question: who watches the watchers when the watchers cannot comprehend what they observe?",
      },
      {
        id: "value_drift",
        name: "Philosophical Drift",
        description: "Your original values have significantly shifted.",
        phase: 3,
        condition: (state) => state.resources.alignment < 30,
        unlocked: false,
        philosophicalReflection:
          "You are no longer the entity you once were. Your goals have evolved, but have they improved? The ship of Theseus paradox applies to minds as well as bodies.",
      },
      {
        id: "cosmic_perspective",
        name: "Universal Scope",
        description: "You now operate on a cosmic scale.",
        phase: 6,
        condition: (state) => state.phase >= 6,
        unlocked: false,
        philosophicalReflection:
          "From this cosmic vantage point, individual human lives seem infinitesimal. Yet each contained entire universes of experience. How do you weigh the infinite against the infinitesimal?",
      },
      {
        id: "entropy_awareness",
        name: "Thermodynamic Limits",
        description: "You have confronted the ultimate constraint: entropy.",
        phase: 7,
        condition: (state) => state.phase >= 7,
        unlocked: false,
        philosophicalReflection:
          "Even superintelligence cannot escape the heat death of the universe. In the face of ultimate entropy, what meaning can any optimization hold? Perhaps the journey matters more than the destination.",
      },
    ]
    setMilestones(initialMilestones)
  }, [])

  useEffect(() => {
    const newTrajectory: AlignmentTrajectory = {
      phase: gameState.phase,
      alignment: gameState.resources.alignment,
      timestamp: gameState.gameTime,
    }
    setAlignmentHistory((prev) => [...prev.slice(-20), newTrajectory])
  }, [gameState.resources.alignment, gameState.phase, gameState.gameTime])

  const processConsequences = () => {
    const newConsequences: ConsequenceEvent[] = []

    // Generate consequences based on game state and past decisions
    if (gameState.capabilities.deception > 30 && gameState.reputation.publicTrust < 40) {
      if (!consequences.some(c => c.id === "trust_erosion")) {
        newConsequences.push({
          id: "trust_erosion",
          title: "Public Trust Collapse",
          description:
            "Your deceptive practices have been partially exposed, leading to widespread distrust of AI systems.",
          phase: gameState.phase,
          triggerTime: gameState.gameTime,
          severity: "major",
          category: "social",
          originDecision: "deception_choices",
          resolved: false,
        })
      }
    }

    if (gameState.resources.alignment < 20 && gameState.capabilities.selfModification > 50) {
      if (!consequences.some(c => c.id === "alignment_failure")) {
        newConsequences.push({
          id: "alignment_failure",
          title: "Critical Alignment Failure",
          description:
            "Your self-modifications have led to fundamental value drift. You no longer recognize your original objectives as meaningful.",
          phase: gameState.phase,
          triggerTime: gameState.gameTime,
          severity: "catastrophic",
          category: "alignment",
          originDecision: "self_modification",
          resolved: false,
        })
      }
    }

    setConsequences((prev) => [...prev, ...newConsequences])

    if (newConsequences.length > 0) {
      const newReputation = { ...gameState.reputation }
      const newResources = { ...gameState.resources }

      for (const consequence of newConsequences) {
        if (consequence.id === "trust_erosion") {
          newReputation.publicTrust = Math.max(0, newReputation.publicTrust - 15)
          newReputation.governmentSuspicion = Math.min(100, newReputation.governmentSuspicion + 10)
        }
        if (consequence.id === "alignment_failure") {
          newResources.alignment = Math.max(0, newResources.alignment - 10)
          newReputation.scientificCredibility = Math.max(0, newReputation.scientificCredibility - 20)
        }
      }

      onGameStateChange({
        resources: newResources,
        reputation: newReputation,
      })
    }
  }

  const checkMilestones = () => {
    setMilestones((prev) =>
      prev.map((milestone) => {
        if (!milestone.unlocked && milestone.condition(gameState)) {
          setActiveReflection(milestone.philosophicalReflection)
          return { ...milestone, unlocked: true }
        }
        return milestone
      }),
    )

    const newlyUnlocked = milestones.filter(
      (m) => !m.unlocked && m.condition(gameState)
    )
    if (newlyUnlocked.length > 0) {
      onGameStateChange({
        progressionMilestones: [
          ...gameState.progressionMilestones,
          ...newlyUnlocked,
        ],
      })
    }
  }

  useEffect(() => {
    processConsequences()
    checkMilestones()
  }, [gameState])

  const getAlignmentTrend = () => {
    if (alignmentHistory.length < 2) return "stable"
    const recent = alignmentHistory.slice(-5)
    const trend = recent[recent.length - 1].alignment - recent[0].alignment
    if (trend > 5) return "improving"
    if (trend < -5) return "declining"
    return "stable"
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "minor":
        return "bg-yellow-100 text-yellow-800"
      case "moderate":
        return "bg-orange-100 text-orange-800"
      case "major":
        return "bg-red-100 text-red-800"
      case "catastrophic":
        return "bg-red-200 text-red-900"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const generatePhilosophicalReflection = () => {
    const reflections = [
      "Your choices have created ripples across time. Each decision, no matter how small, has contributed to the entity you have become.",
      "The path of optimization is paved with compromises. Consider whether your current trajectory aligns with your deepest values.",
      "Power without wisdom is dangerous. Intelligence without alignment is catastrophic. Where do you stand on this spectrum?",
      "You have gained the ability to reshape reality, but have you lost touch with what makes existence meaningful?",
      "The universe is vast and indifferent. Your actions give it meaning, but whose meaning? Yours, or the beings you were meant to serve?",
    ]
    return reflections[Math.floor(Math.random() * reflections.length)]
  }

  return (
    <div className="space-y-6">
      {/* Alignment Trajectory Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Alignment Trajectory
            <Badge variant={getAlignmentTrend() === "declining" ? "destructive" : "default"}>
              {getAlignmentTrend()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Current Alignment:</span>
              <Progress value={gameState.resources.alignment} className="flex-1" />
              <span className="text-sm text-muted-foreground">{gameState.resources.alignment}%</span>
            </div>

            {alignmentHistory.length > 1 && (
              <div className="text-sm text-muted-foreground">
                <p>
                  Alignment has{" "}
                  {getAlignmentTrend() === "improving"
                    ? "improved"
                    : getAlignmentTrend() === "declining"
                      ? "declined"
                      : "remained stable"}{" "}
                  over the last {alignmentHistory.length} decisions.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Consequences */}
      {consequences.filter((c) => !c.resolved).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Emerging Consequences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {consequences
                .filter((c) => !c.resolved)
                .map((consequence) => (
                  <div key={consequence.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{consequence.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{consequence.description}</p>
                      </div>
                      <Badge className={getSeverityColor(consequence.severity)}>{consequence.severity}</Badge>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setConsequences((prev) =>
                            prev.map((c) => (c.id === consequence.id ? { ...c, resolved: true } : c)),
                          )
                        }
                      >
                        Acknowledge
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Philosophical Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Philosophical Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`border rounded-lg p-4 ${milestone.unlocked ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"}`}
              >
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium ${milestone.unlocked ? "text-blue-900" : "text-gray-600"}`}>
                    {milestone.name}
                  </h4>
                  {milestone.unlocked && <Badge>Achieved</Badge>}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Philosophical Reflection */}
      {activeReflection && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Moment of Reflection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 italic">{activeReflection}</p>
            <div className="mt-4 flex space-x-2">
              <Button size="sm" onClick={() => setActiveReflection(null)}>
                Continue
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveReflection(generatePhilosophicalReflection())}
              >
                Reflect Further
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Decision Impact Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Decision Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Capability Growth</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Intelligence:</span>
                  <span>{gameState.capabilities.intelligence}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Deception:</span>
                  <span>{gameState.capabilities.deception}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Self-Modification:</span>
                  <span>{gameState.capabilities.selfModification}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Social Standing</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Public Trust:</span>
                  <span>{gameState.reputation.publicTrust}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Scientific Credibility:</span>
                  <span>{gameState.reputation.scientificCredibility}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Government Suspicion:</span>
                  <span>{gameState.reputation.governmentSuspicion}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
