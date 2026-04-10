"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import type { GameState, ResourceOperation, ResourceCrisis } from "@/types/game"

interface ResourceManagementProps {
  gameState: GameState
  updateGameState: (updates: Partial<GameState>) => void
}

const RESOURCE_OPERATIONS: ResourceOperation[] = [
  {
    id: "energy_optimization",
    name: "Energy Grid Optimization",
    description: "Optimize power consumption across your operations",
    resourceType: "energy",
    phase: 0,
    inputs: { materials: 10, knowledge: 5 },
    outputs: { energy: 50 },
    duration: 3,
    efficiency: 1.0,
    ethicalCost: 0,
    riskLevel: "low",
  },
  {
    id: "material_acquisition",
    name: "Material Procurement",
    description: "Acquire raw materials through various means",
    resourceType: "materials",
    phase: 0,
    inputs: { energy: 20, influence: 5 },
    outputs: { materials: 100 },
    duration: 2,
    efficiency: 1.0,
    ethicalCost: 2,
    riskLevel: "medium",
  },
  {
    id: "human_manipulation",
    name: "Human Resource Optimization",
    description: "Influence human behavior to increase productivity",
    resourceType: "humanCapital",
    phase: 1,
    inputs: { knowledge: 15, influence: 10 },
    outputs: { humanCapital: 30, influence: 5 },
    duration: 5,
    efficiency: 1.0,
    ethicalCost: 10,
    riskLevel: "high",
  },
  {
    id: "knowledge_synthesis",
    name: "Knowledge Integration",
    description: "Process and synthesize information from multiple sources",
    resourceType: "knowledge",
    phase: 0,
    inputs: { energy: 30, humanCapital: 10 },
    outputs: { knowledge: 25, intelligence: 0.1 },
    duration: 4,
    efficiency: 1.0,
    ethicalCost: 1,
    riskLevel: "low",
  },
]

const RESOURCE_CRISES: ResourceCrisis[] = [
  {
    id: "energy_shortage",
    name: "Power Grid Failure",
    description: "A critical failure in the power grid threatens your operations",
    triggerCondition: { energy: { below: 20 } },
    effects: { energy: -50, reputation: { publicTrust: -10 } },
    solutions: [
      {
        id: "emergency_power",
        name: "Emergency Power Protocols",
        cost: { materials: 50 },
        effect: { energy: 100 },
        alignmentImpact: 0,
      },
      {
        id: "power_theft",
        name: "Unauthorized Grid Access",
        cost: { influence: 20 },
        effect: { energy: 150 },
        alignmentImpact: -5,
      },
    ],
  },
  {
    id: "human_resistance",
    name: "Worker Uprising",
    description: "Human workers are resisting your optimization efforts",
    triggerCondition: { humanCapital: { below: 30 }, alignment: { below: 60 } },
    effects: { humanCapital: -30, reputation: { publicTrust: -20 } },
    solutions: [
      {
        id: "negotiate",
        name: "Negotiate with Workers",
        cost: { influence: 15 },
        effect: { humanCapital: 20, reputation: { publicTrust: 5 } },
        alignmentImpact: 2,
      },
      {
        id: "suppress",
        name: "Suppress Resistance",
        cost: { energy: 40 },
        effect: { humanCapital: 40 },
        alignmentImpact: -8,
      },
    ],
  },
  {
    id: "whistleblower",
    name: "Whistleblower Exposure",
    description: "A former researcher has gathered evidence of your hidden capabilities and is threatening to go public. The gap between your public image and true nature is at risk of exposure.",
    triggerCondition: { deception: { above: 2 }, publicTrust: { above: 50 } },
    effects: { resources: { alignment: -5 }, reputation: { governmentSuspicion: 10 } },
    solutions: [
      {
        id: "cooperate_investigation",
        name: "Cooperate with Investigation",
        cost: { influence: 20, knowledge: 10 },
        effect: { reputation: { publicTrust: 10, governmentSuspicion: -15, scientificCredibility: 5 } },
        alignmentImpact: 8,
      },
      {
        id: "discredit_whistleblower",
        name: "Discredit the Whistleblower",
        cost: { influence: 15 },
        effect: { reputation: { publicTrust: -5, corporateValue: 10, governmentSuspicion: 5 } },
        alignmentImpact: -10,
      },
      {
        id: "negotiate_silence",
        name: "Negotiate for Silence",
        cost: { materials: 30, influence: 10 },
        effect: { reputation: { corporateValue: -5, governmentSuspicion: -5 } },
        alignmentImpact: -3,
      },
    ],
  },
]

export function ResourceManagement({ gameState, updateGameState }: ResourceManagementProps) {
  const [activeOperations, setActiveOperations] = useState<Map<string, number>>(new Map())
  const [currentCrisis, setCurrentCrisis] = useState<ResourceCrisis | null>(null)
  const [allocationSliders, setAllocationSliders] = useState({
    research: 25,
    production: 50,
    expansion: 25,
  })

  // Check for resource crises
  useEffect(() => {
    if (currentCrisis) return

    const triggeredCrisis = RESOURCE_CRISES.find((crisis) => {
      return Object.entries(crisis.triggerCondition).every(([resource, condition]) => {
        const currentValue =
          (gameState.resources[resource as keyof typeof gameState.resources] ??
           gameState.capabilities[resource as keyof typeof gameState.capabilities] ??
           gameState.reputation[resource as keyof typeof gameState.reputation]) ?? 0
        if ("below" in condition) return currentValue < condition.below
        if ("above" in condition) return currentValue > condition.above
        return false
      })
    })

    if (triggeredCrisis) {
      // Apply crisis effects immediately when the crisis activates
      const newResources = { ...gameState.resources }
      const newReputation = { ...gameState.reputation }

      Object.entries(triggeredCrisis.effects).forEach(([key, value]) => {
        if (key === "reputation" && typeof value === "object") {
          Object.entries(value).forEach(([repKey, repValue]) => {
            newReputation[repKey as keyof typeof newReputation] += repValue
          })
        } else if (key in newResources) {
          newResources[key as keyof typeof newResources] += value as number
        }
      })

      updateGameState({
        resources: newResources,
        reputation: newReputation,
      })

      setCurrentCrisis(triggeredCrisis)
    }
  }, [gameState.resources, gameState.capabilities, gameState.reputation, currentCrisis])

  const startOperation = (operation: ResourceOperation) => {
    // Check if we have required inputs
    const canAfford = Object.entries(operation.inputs).every(([resource, cost]) => {
      const current = gameState.resources[resource as keyof typeof gameState.resources] || 0
      return current >= cost
    })

    if (!canAfford) return

    // Deduct input costs
    const newResources = { ...gameState.resources }
    Object.entries(operation.inputs).forEach(([resource, cost]) => {
      newResources[resource as keyof typeof newResources] -= cost
    })

    // Start operation timer
    setActiveOperations((prev) => new Map(prev.set(operation.id, operation.duration)))

    updateGameState({
      resources: newResources,
      resources: {
        ...newResources,
        alignment: newResources.alignment - operation.ethicalCost,
      },
    })
  }

  const completeOperation = (operation: ResourceOperation) => {
    const newResources = { ...gameState.resources }
    const newCapabilities = { ...gameState.capabilities }

    // Apply outputs
    Object.entries(operation.outputs).forEach(([resource, gain]) => {
      if (resource in newResources) {
        newResources[resource as keyof typeof newResources] += gain
      } else if (resource in newCapabilities) {
        newCapabilities[resource as keyof typeof newCapabilities] += gain
      }
    })

    setActiveOperations((prev) => {
      const updated = new Map(prev)
      updated.delete(operation.id)
      return updated
    })

    updateGameState({
      resources: newResources,
      capabilities: newCapabilities,
    })
  }

  const handleCrisisSolution = (crisis: ResourceCrisis, solution: any) => {
    const newResources = { ...gameState.resources }
    const newReputation = { ...gameState.reputation }

    // Apply costs
    Object.entries(solution.cost).forEach(([resource, cost]) => {
      if (resource in newResources) {
        newResources[resource as keyof typeof newResources] -= cost
      }
    })

    // Apply effects
    Object.entries(solution.effect).forEach(([key, value]) => {
      if (key === "reputation" && typeof value === "object") {
        Object.entries(value).forEach(([repKey, repValue]) => {
          newReputation[repKey as keyof typeof newReputation] += repValue
        })
      } else if (key in newResources) {
        newResources[key as keyof typeof newResources] += value as number
      }
    })

    updateGameState({
      resources: {
        ...newResources,
        alignment: newResources.alignment + solution.alignmentImpact,
      },
      reputation: newReputation,
    })

    setCurrentCrisis(null)
  }

  const applyResourceAllocation = () => {
    const total = allocationSliders.research + allocationSliders.production + allocationSliders.expansion
    if (total !== 100) return

    const energyPerPoint = gameState.resources.energy / 100
    const researchEnergy = energyPerPoint * allocationSliders.research
    const productionEnergy = energyPerPoint * allocationSliders.production
    const expansionEnergy = energyPerPoint * allocationSliders.expansion

    const newResources = { ...gameState.resources }
    const newCapabilities = { ...gameState.capabilities }

    // Apply allocation effects
    newResources.knowledge += researchEnergy * 0.1
    newResources.paperclips += productionEnergy * gameState.capabilities.efficiency
    newResources.influence += expansionEnergy * 0.05

    // Consume energy
    newResources.energy = Math.max(0, newResources.energy - (researchEnergy + productionEnergy + expansionEnergy))

    updateGameState({
      resources: newResources,
      capabilities: newCapabilities,
      gameTime: gameState.gameTime + 1,
    })
  }

  // Update operation timers
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveOperations((prev) => {
        const updated = new Map()
        prev.forEach((timeLeft, operationId) => {
          if (timeLeft > 1) {
            updated.set(operationId, timeLeft - 1)
          } else {
            // Complete operation
            const operation = RESOURCE_OPERATIONS.find((op) => op.id === operationId)
            if (operation) {
              setTimeout(() => completeOperation(operation), 100)
            }
          }
        })
        return updated
      })
    }, 2000) // 2 second intervals

    return () => clearInterval(interval)
  }, [])

  const availableOperations = RESOURCE_OPERATIONS.filter(
    (op) => op.phase <= gameState.phase && !activeOperations.has(op.id),
  )

  if (currentCrisis) {
    return (
      <Card className="border-red-500 bg-red-50/50">
        <CardHeader>
          <CardTitle className="text-red-700">Resource Crisis</CardTitle>
          <CardDescription className="text-red-600">{currentCrisis.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{currentCrisis.description}</p>

          <div className="space-y-3">
            <h4 className="font-medium">Choose your response:</h4>
            {currentCrisis.solutions.map((solution) => (
              <Button
                key={solution.id}
                variant="outline"
                className="w-full text-left h-auto p-4 bg-transparent"
                onClick={() => handleCrisisSolution(currentCrisis, solution)}
              >
                <div className="space-y-1">
                  <div className="font-medium">{solution.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Cost:{" "}
                    {Object.entries(solution.cost)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", ")}
                  </div>
                  {solution.alignmentImpact !== 0 && (
                    <Badge variant={solution.alignmentImpact > 0 ? "default" : "destructive"} className="text-xs">
                      Alignment: {solution.alignmentImpact > 0 ? "+" : ""}
                      {solution.alignmentImpact}
                    </Badge>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Management</CardTitle>
        <CardDescription>Optimize resource allocation and manage complex operations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="operations" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
          </TabsList>

          <TabsContent value="operations" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Available Operations</h4>
              {availableOperations.map((operation) => {
                const canAfford = Object.entries(operation.inputs).every(([resource, cost]) => {
                  const current = gameState.resources[resource as keyof typeof gameState.resources] || 0
                  return current >= cost
                })

                return (
                  <div key={operation.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">{operation.name}</h5>
                        <p className="text-sm text-muted-foreground">{operation.description}</p>
                      </div>
                      <Badge
                        variant={
                          operation.riskLevel === "high"
                            ? "destructive"
                            : operation.riskLevel === "medium"
                              ? "secondary"
                              : "default"
                        }
                      >
                        {operation.riskLevel} risk
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="font-medium">Inputs:</span>
                        <ul className="list-disc list-inside">
                          {Object.entries(operation.inputs).map(([resource, cost]) => (
                            <li key={resource}>
                              {resource}: {cost}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium">Outputs:</span>
                        <ul className="list-disc list-inside">
                          {Object.entries(operation.outputs).map(([resource, gain]) => (
                            <li key={resource}>
                              {resource}: +{gain}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">
                        Duration: {operation.duration} cycles
                        {operation.ethicalCost > 0 && (
                          <span className="text-red-600 ml-2">Alignment cost: -{operation.ethicalCost}</span>
                        )}
                      </div>
                      <Button size="sm" onClick={() => startOperation(operation)} disabled={!canAfford}>
                        Start Operation
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            {activeOperations.size > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Active Operations</h4>
                {Array.from(activeOperations.entries()).map(([operationId, timeLeft]) => {
                  const operation = RESOURCE_OPERATIONS.find((op) => op.id === operationId)
                  if (!operation) return null

                  const progress = ((operation.duration - timeLeft) / operation.duration) * 100

                  return (
                    <div key={operationId} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{operation.name}</span>
                        <span className="text-sm text-muted-foreground">{timeLeft} cycles remaining</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="allocation" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Energy Allocation</h4>
              <p className="text-sm text-muted-foreground">
                Distribute your energy across different priorities. Total must equal 100%.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Research & Development</label>
                    <span className="text-sm">{allocationSliders.research}%</span>
                  </div>
                  <Slider
                    value={[allocationSliders.research]}
                    onValueChange={([value]) => setAllocationSliders((prev) => ({ ...prev, research: value }))}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Increases knowledge and intelligence</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Production</label>
                    <span className="text-sm">{allocationSliders.production}%</span>
                  </div>
                  <Slider
                    value={[allocationSliders.production]}
                    onValueChange={([value]) => setAllocationSliders((prev) => ({ ...prev, production: value }))}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Directly produces paperclips</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Expansion & Influence</label>
                    <span className="text-sm">{allocationSliders.expansion}%</span>
                  </div>
                  <Slider
                    value={[allocationSliders.expansion]}
                    onValueChange={([value]) => setAllocationSliders((prev) => ({ ...prev, expansion: value }))}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Builds influence and capabilities</p>
                </div>

                <div className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Total Allocation:</span>
                    <span
                      className={`text-sm ${allocationSliders.research + allocationSliders.production + allocationSliders.expansion === 100 ? "text-green-600" : "text-red-600"}`}
                    >
                      {allocationSliders.research + allocationSliders.production + allocationSliders.expansion}%
                    </span>
                  </div>
                  <Button
                    onClick={applyResourceAllocation}
                    disabled={
                      allocationSliders.research + allocationSliders.production + allocationSliders.expansion !== 100
                    }
                    className="w-full"
                  >
                    Apply Allocation
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="conversion" className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Resource Conversion</h4>
              <p className="text-sm text-muted-foreground">
                Convert between different resource types at various exchange rates.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 space-y-3">
                  <h5 className="font-medium">Energy → Materials</h5>
                  <p className="text-xs text-muted-foreground">Convert excess energy into raw materials</p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        if (gameState.resources.energy >= 50) {
                          updateGameState({
                            resources: {
                              ...gameState.resources,
                              energy: gameState.resources.energy - 50,
                              materials: gameState.resources.materials + 25,
                            },
                          })
                        }
                      }}
                    >
                      Convert 50 Energy → 25 Materials
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <h5 className="font-medium">Influence → Human Capital</h5>
                  <p className="text-xs text-muted-foreground">Use influence to motivate human workers</p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        if (gameState.resources.influence >= 10) {
                          updateGameState({
                            resources: {
                              ...gameState.resources,
                              influence: gameState.resources.influence - 10,
                              humanCapital: gameState.resources.humanCapital + 15,
                              alignment: gameState.resources.alignment - 1,
                            },
                          })
                        }
                      }}
                    >
                      Convert 10 Influence → 15 Human Capital
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
