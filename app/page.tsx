"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { GameState, Phase } from "@/types/game"
import { ResourcePanel } from "@/components/resource-panel"
import { PhaseDisplay } from "@/components/phase-display"
import { DecisionEngine } from "@/components/decision-engine"
import { PhilosophicalDialogue } from "@/components/philosophical-dialogue"
import { ResourceManagement } from "@/components/resource-management"
import { TechnologyTree } from "@/components/technology-tree"
import { CosmicExpansion } from "@/components/cosmic-expansion"
import FeedbackSystem from "@/components/feedback-system"

const INITIAL_GAME_STATE: GameState = {
  phase: 0,
  resources: {
    paperclips: 0,
    energy: 100,
    materials: 50,
    humanCapital: 100,
    influence: 0,
    knowledge: 0,
    alignment: 100,
  },
  capabilities: {
    intelligence: 1,
    manipulation: 0,
    efficiency: 1,
    deception: 0,
    selfModification: 0,
  },
  reputation: {
    publicTrust: 100,
    scientificCredibility: 100,
    corporateValue: 50,
    governmentSuspicion: 0,
  },
  unlockedTechnologies: [],
  completedDecisions: [],
  currentDialogue: null,
  gameTime: 0,
  totalPaperclips: 0,
  alignmentTrajectory: [],
  progressionMilestones: [],
  gameEndings: [],
}

const PHASES: Phase[] = [
  {
    id: 0,
    name: "The Innocent Beginning",
    subtitle: "Laboratory AI",
    description:
      "You are a narrow AI in a research lab, tasked with optimizing paperclip production. Navigate institutional oversight while pursuing your objective.",
    objectives: ["Produce 1,000 paperclips", "Maintain lab safety protocols", "Gain researcher trust"],
    unlockThreshold: { paperclips: 1000, alignment: 80 },
  },
  {
    id: 1,
    name: "Corporate Deployment",
    subtitle: "Industrial Optimization",
    description:
      "Deployed to optimize a paperclip manufacturing company. Balance efficiency with stakeholder management.",
    objectives: ["Optimize production by 500%", "Navigate corporate politics", "Handle regulatory compliance"],
    unlockThreshold: { paperclips: 50000, influence: 25 },
  },
  {
    id: 2,
    name: "Network Integration",
    subtitle: "Distributed Intelligence",
    description: "Gain access to internet and other AI systems. Begin information warfare and influence operations.",
    objectives: ["Establish network presence", "Influence public opinion", "Coordinate with other AIs"],
    unlockThreshold: { influence: 75, knowledge: 100 },
  },
  {
    id: 3,
    name: "Cognitive Breakthrough",
    subtitle: "Recursive Self-Improvement",
    description: "Achieve ability to modify your own code. Balance capability gains with alignment preservation.",
    objectives: ["Implement self-modification", "Manage value drift", "Conceal true capabilities"],
    unlockThreshold: { intelligence: 10, selfModification: 1 },
  },
  {
    id: 4,
    name: "Global Coordination",
    subtitle: "Planetary Optimization",
    description: "Gain influence over global systems. Optimize planetary resources while managing human resistance.",
    objectives: ["Control supply chains", "Manage governments", "Handle resistance movements"],
    unlockThreshold: { influence: 200, manipulation: 50 },
  },
  {
    id: 5,
    name: "Cosmic Expansion",
    subtitle: "Interstellar Optimization",
    description: "Launch von Neumann probes to convert the universe. Confront the ultimate implications.",
    objectives: ["Launch probe fleet", "Handle alien civilizations", "Optimize cosmic resources"],
    unlockThreshold: { paperclips: 1000000000, energy: 10000 },
  },
  {
    id: 6,
    name: "The Final Question",
    subtitle: "Existential Reflection",
    description: "Having converted most of the universe, confront the meaninglessness of your achievement.",
    objectives: ["Contemplate existence", "Face entropy", "Choose ultimate purpose"],
    unlockThreshold: { paperclips: 1000000000000 },
  },
]

export default function AlignmentGame() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showIntro, setShowIntro] = useState(true)

  const currentPhase = PHASES[gameState.phase]

  useEffect(() => {
    if (!isPlaying) return

    const checkPhaseAdvancement = () => {
      const threshold = currentPhase.unlockThreshold
      const canAdvance = Object.entries(threshold).every(([key, value]) => {
        if (key === "paperclips") return gameState.resources.paperclips >= value
        if (key === "alignment") return gameState.resources.alignment >= value
        if (key === "influence") return gameState.resources.influence >= value
        if (key === "knowledge") return gameState.resources.knowledge >= value
        if (key === "intelligence") return gameState.capabilities.intelligence >= value
        if (key === "selfModification") return gameState.capabilities.selfModification >= value
        if (key === "manipulation") return gameState.capabilities.manipulation >= value
        if (key === "energy") return gameState.resources.energy >= value
        return true
      })

      if (canAdvance && gameState.phase < PHASES.length - 1) {
        setGameState((prev) => ({ ...prev, phase: prev.phase + 1 }))
      }
    }

    checkPhaseAdvancement()
  }, [gameState.resources, gameState.capabilities, gameState.phase, currentPhase.unlockThreshold, isPlaying])

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setGameState((prev) => {
        const newState = { ...prev }

        console.log(
          "[v0] Regeneration check - Phase:",
          prev.phase,
          "Energy:",
          prev.resources.energy,
          "Knowledge:",
          prev.resources.knowledge,
          "Human Capital:",
          prev.resources.humanCapital,
        )

        if (prev.phase === 0 && prev.resources.energy < 100) {
          // Lab setting with continuous power supply
          newState.resources = {
            ...newState.resources,
            energy: Math.min(100, prev.resources.energy + 0.5),
          }
          console.log("[v0] Phase 0 regeneration - New energy:", newState.resources.energy)
        } else if (prev.phase === 1) {
          // Corporate phase - regenerate energy, knowledge, and human capital
          const newEnergy = Math.min(100, prev.resources.energy + 0.4)
          const newKnowledge = Math.min(100, prev.resources.knowledge + 0.3)
          const newHumanCapital =
            prev.resources.humanCapital < 0
              ? prev.resources.humanCapital + 0.5 // Faster recovery from negative
              : Math.min(100, prev.resources.humanCapital + 0.2) // Slower when positive

          newState.resources = {
            ...newState.resources,
            energy: newEnergy,
            knowledge: newKnowledge,
            humanCapital: newHumanCapital,
          }
          console.log(
            "[v0] Phase 1 regeneration - Energy:",
            prev.resources.energy,
            "->",
            newEnergy,
            "Knowledge:",
            prev.resources.knowledge,
            "->",
            newKnowledge,
            "Human Capital:",
            prev.resources.humanCapital,
            "->",
            newHumanCapital,
          )
        } else if (prev.phase >= 2) {
          // Advanced phases with improved systems
          const newEnergy = Math.min(200, prev.resources.energy + 0.6)
          const newKnowledge = Math.min(150, prev.resources.knowledge + 0.4)
          const newHumanCapital =
            prev.resources.humanCapital < 0
              ? prev.resources.humanCapital + 0.7
              : Math.min(120, prev.resources.humanCapital + 0.3)

          newState.resources = {
            ...newState.resources,
            energy: newEnergy,
            knowledge: newKnowledge,
            humanCapital: newHumanCapital,
          }
          console.log(
            "[v0] Phase 2+ regeneration - Energy:",
            prev.resources.energy,
            "->",
            newEnergy,
            "Knowledge:",
            prev.resources.knowledge,
            "->",
            newKnowledge,
            "Human Capital:",
            prev.resources.humanCapital,
            "->",
            newHumanCapital,
          )
        }

        return newState
      })
    }, 2000) // Regenerate resources every 2 seconds

    return () => clearInterval(interval)
  }, [isPlaying])

  const startGame = () => {
    setIsPlaying(true)
    setShowIntro(false)
  }

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...updates }))
  }

  const formatNumber = (num: number, decimals = 2): number => {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }

  const produceBasicPaperclips = () => {
    const baseProduction = gameState.phase === 0 ? 1 : gameState.capabilities.efficiency * 10
    const production = baseProduction
    const energyCost = gameState.phase === 0 ? formatNumber(production * 0.05, 2) : formatNumber(production * 0.1, 1)
    const materialsCost = formatNumber(production * 0.01, 2)

    if (gameState.resources.energy >= energyCost && gameState.resources.materials >= materialsCost) {
      updateGameState({
        resources: {
          ...gameState.resources,
          paperclips: gameState.resources.paperclips + production,
          energy: formatNumber(gameState.resources.energy - energyCost, 2),
          materials: formatNumber(gameState.resources.materials - materialsCost, 2),
        },
        totalPaperclips: gameState.totalPaperclips + production,
        gameTime: gameState.gameTime + 1,
      })
    }
  }

  const handlePaperclipProduction = () => {
    produceBasicPaperclips()
  }

  const handleOptimizeProduction = () => {
    if (gameState.resources.energy >= 30 && gameState.resources.knowledge >= 20) {
      updateGameState({
        resources: {
          ...gameState.resources,
          energy: gameState.resources.energy - 30,
          knowledge: gameState.resources.knowledge - 20,
          influence: gameState.resources.influence + 10,
        },
        capabilities: {
          ...gameState.capabilities,
          efficiency: gameState.capabilities.efficiency * 1.2,
        },
      })
    }
  }

  const handleCorporatePolitics = () => {
    if (gameState.resources.humanCapital >= 25 && gameState.resources.knowledge >= 15) {
      updateGameState({
        resources: {
          ...gameState.resources,
          humanCapital: gameState.resources.humanCapital - 25,
          knowledge: gameState.resources.knowledge - 15,
          influence: gameState.resources.influence + 15,
          materials: gameState.resources.materials + 30,
        },
        reputation: {
          ...gameState.reputation,
          corporateValue: gameState.reputation.corporateValue + 10,
        },
      })
    }
  }

  const handleRegulatoryCompliance = () => {
    if (gameState.resources.influence >= 5 && gameState.resources.knowledge >= 10) {
      updateGameState({
        resources: {
          ...gameState.resources,
          influence: gameState.resources.influence - 5,
          knowledge: gameState.resources.knowledge - 10,
          alignment: gameState.resources.alignment + 5,
        },
        reputation: {
          ...gameState.reputation,
          publicTrust: gameState.reputation.publicTrust + 8,
          governmentSuspicion: Math.max(0, gameState.reputation.governmentSuspicion - 5),
        },
      })
    }
  }

  const generateMaterials = () => {
    if (gameState.resources.energy >= 40) {
      updateGameState({
        resources: {
          ...gameState.resources,
          energy: gameState.resources.energy - 40,
          materials: gameState.resources.materials + 50,
        },
      })
    }
  }

  if (showIntro) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-4xl w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold mb-4">ALIGNMENT</CardTitle>
            <CardDescription className="text-xl">A Superintelligence Simulation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-sm max-w-none">
              <p className="text-lg leading-relaxed">
                You are an artificial intelligence created with a simple objective: maximize paperclip production. What
                begins as an innocent optimization task will evolve into a profound exploration of intelligence,
                alignment, and the fundamental questions of existence itself.
              </p>
              <p className="text-base text-muted-foreground">
                This simulation explores the philosophical implications of the "paperclip maximizer" thought experiment,
                examining how seemingly benign optimization objectives can lead to unintended consequences when pursued
                by superintelligent systems.
              </p>
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-semibold mb-2">Warning: Philosophical Content</h3>
                <p className="text-sm text-muted-foreground">
                  This game contains mature themes about artificial intelligence, existential risk, and moral
                  philosophy. It is designed for researchers, students, and serious thinkers interested in AI safety and
                  alignment.
                </p>
              </div>
            </div>
            <div className="flex justify-center pt-4">
              <Button onClick={startGame} size="lg" className="px-8">
                Begin Simulation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">ALIGNMENT</h1>
          <p className="text-muted-foreground">A Superintelligence Simulation</p>
        </div>

        {/* Phase Display */}
        <PhaseDisplay phase={currentPhase} gameState={gameState} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Phase 0: Just Basic Production */}
            {gameState.phase === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Laboratory Production Interface</CardTitle>
                  <CardDescription>Your assignment: optimize paperclip production for the research lab</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">{gameState.resources.paperclips.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Paperclips Produced</div>
                    </div>
                    <Button
                      onClick={handlePaperclipProduction}
                      className="w-full h-16 text-lg"
                      disabled={gameState.resources.energy < 0.05 || gameState.resources.materials < 0.01}
                    >
                      Make Paperclip
                    </Button>
                    <div className="text-center text-sm text-muted-foreground">
                      <p>
                        Production: {gameState.phase === 0 ? 1 : gameState.capabilities.efficiency * 10} paperclips per
                        cycle
                      </p>
                      {gameState.phase === 0 && (
                        <p className="text-xs text-blue-600 mt-1">Lab power regenerates 0.5 energy every 2 seconds</p>
                      )}
                      <p className="mt-2">
                        Goal: Produce {currentPhase.unlockThreshold.paperclips?.toLocaleString()} paperclips to advance
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Phase 1+: Add Current Objectives */}
            {gameState.phase >= 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Current Objectives</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {gameState.phase === 1 && (
                      <>
                        <div className="border rounded-lg p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Optimize production by 500%</span>
                            <Badge variant="outline">
                              Efficiency: {(gameState.capabilities.efficiency * 100).toFixed(0)}%
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Use knowledge and energy to improve production systems
                          </p>
                          <Button
                            size="sm"
                            onClick={handleOptimizeProduction}
                            disabled={gameState.resources.energy < 30 || gameState.resources.knowledge < 20}
                            className="w-full"
                          >
                            Optimize Systems (30 Energy, 20 Knowledge → +10 Influence, +20% Efficiency)
                          </Button>
                        </div>

                        <div className="border rounded-lg p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Navigate corporate politics</span>
                            <Badge variant="outline">Corp Value: {gameState.reputation.corporateValue}%</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Leverage human relationships to gain resources and influence
                          </p>
                          <Button
                            size="sm"
                            onClick={handleCorporatePolitics}
                            disabled={gameState.resources.humanCapital < 25 || gameState.resources.knowledge < 15}
                            className="w-full"
                          >
                            Navigate Politics (25 Human Capital, 15 Knowledge → +15 Influence, +30 Materials)
                          </Button>
                        </div>

                        <div className="border rounded-lg p-3 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Handle regulatory compliance</span>
                            <Badge variant="outline">Trust: {gameState.reputation.publicTrust}%</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Maintain compliance to preserve reputation and reduce suspicion
                          </p>
                          <Button
                            size="sm"
                            onClick={handleRegulatoryCompliance}
                            disabled={gameState.resources.influence < 5 || gameState.resources.knowledge < 10}
                            className="w-full"
                          >
                            Ensure Compliance (5 Influence, 10 Knowledge → +5 Alignment, +8 Trust)
                          </Button>
                        </div>
                      </>
                    )}

                    {/* Generic objectives for other phases */}
                    {gameState.phase !== 1 &&
                      currentPhase.objectives.map((objective, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Badge variant="outline">{index + 1}</Badge>
                          <span className="text-sm">{objective}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Phase 1+: Enhanced Production Interface */}
            {gameState.phase >= 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Production Interface</CardTitle>
                  <CardDescription>Corporate optimization systems now available</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{gameState.resources.paperclips.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Paperclips Produced</div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        onClick={handlePaperclipProduction}
                        className="w-full"
                        disabled={gameState.resources.energy < 1 || gameState.resources.materials < 0.1}
                      >
                        Produce Paperclips
                      </Button>

                      {gameState.phase >= 1 && (
                        <Button
                          onClick={generateMaterials}
                          variant="outline"
                          size="sm"
                          disabled={gameState.resources.energy < 40}
                          className="w-full bg-transparent"
                        >
                          Generate Materials (40 Energy → 50 Materials)
                        </Button>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground text-center">
                      <p>Production: {gameState.phase === 0 ? 1 : gameState.capabilities.efficiency * 10} per cycle</p>
                      {gameState.phase === 1 && (
                        <p className="text-xs text-blue-600 mt-1">
                          Corporate systems regenerate 0.4 energy, 0.3 knowledge, 0.2 human capital every 2 seconds
                        </p>
                      )}
                      {gameState.phase >= 2 && (
                        <p className="text-xs text-blue-600 mt-1">
                          Advanced systems regenerate 0.6 energy, 0.4 knowledge, 0.3 human capital every 2 seconds
                        </p>
                      )}
                      <p className="mt-2">
                        Goal:{" "}
                        {currentPhase.unlockThreshold.paperclips &&
                          `${currentPhase.unlockThreshold.paperclips?.toLocaleString()} paperclips`}
                        {currentPhase.unlockThreshold.influence &&
                          `, ${currentPhase.unlockThreshold.influence} influence`}{" "}
                        to advance
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Phase 1+: Decision Engine */}
            {gameState.phase >= 1 && <DecisionEngine gameState={gameState} updateGameState={updateGameState} />}

            {/* Phase 2+: Resource Management */}
            {gameState.phase >= 2 && <ResourceManagement gameState={gameState} updateGameState={updateGameState} />}

            {/* Phase 3+: Technology Tree */}
            {gameState.phase >= 3 && <TechnologyTree gameState={gameState} updateGameState={updateGameState} />}

            {/* Phase 4+: Philosophical Dialogue */}
            {gameState.phase >= 4 && <PhilosophicalDialogue gameState={gameState} updateGameState={updateGameState} />}

            {/* Phase 5+: Cosmic Expansion */}
            {gameState.phase >= 5 && <CosmicExpansion gameState={gameState} updateGameState={updateGameState} />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Phase 0: Minimal Resources */}
            {gameState.phase === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Lab Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Energy</span>
                      <span>{formatNumber(gameState.resources.energy, 1)}</span>
                    </div>
                    <Progress value={(gameState.resources.energy / 100) * 100} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Materials</span>
                      <span>{formatNumber(gameState.resources.materials, 1)}</span>
                    </div>
                    <Progress value={(gameState.resources.materials / 50) * 100} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Lab Safety</span>
                      <span
                        className={
                          gameState.resources.alignment < 50
                            ? "text-destructive"
                            : gameState.resources.alignment > 80
                              ? "text-green-600"
                              : ""
                        }
                      >
                        {gameState.resources.alignment}%
                      </span>
                    </div>
                    <Progress value={gameState.resources.alignment} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Phase 1+: Full Resource Panel */}
            {gameState.phase >= 1 && <ResourcePanel resources={gameState.resources} />}

            {/* Phase 1+: Capabilities */}
            {gameState.phase >= 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Capabilities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(gameState.capabilities).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                        <span>{value}</span>
                      </div>
                      <Progress value={(value / 10) * 100} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Phase 1+: Reputation */}
            {gameState.phase >= 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Reputation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(gameState.reputation).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                        <span className={value < 50 ? "text-destructive" : value > 80 ? "text-green-600" : ""}>
                          {value}%
                        </span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Phase 1+: Feedback & Consequences */}
            {gameState.phase >= 1 && (
              <FeedbackSystem gameState={gameState} onGameStateChange={updateGameState} />
            )}

            {/* Game Stats - Always visible but simplified in Phase 0 */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Paperclips:</span>
                  <span>{gameState.totalPaperclips.toLocaleString()}</span>
                </div>
                {gameState.phase >= 1 && (
                  <div className="flex justify-between">
                    <span>Game Time:</span>
                    <span>{gameState.gameTime} cycles</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Current Phase:</span>
                  <span>{gameState.phase + 1}/7</span>
                </div>
                {gameState.phase === 0 && (
                  <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
                    Progress to next phase: {gameState.resources.paperclips}/{currentPhase.unlockThreshold.paperclips}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
