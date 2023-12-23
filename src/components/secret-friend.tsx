"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import React, { useState } from "react";
import { XIcon } from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "~/lib/utils";

const LS_KEYS = {
  participants: "Amigo_Secreto___participants",
  played: "Amigo_Secreto___played_participants",
  assigned: "Amigo_Secreto___assigned_participants",
  gamestarted: "Amigo_Secreto___game_started",
};

export function SecretFriend() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [gameStarted, setGameStarted] = useState(() => {
    const item = localStorage.getItem(LS_KEYS.gamestarted) ?? "";
    return item === "true";
  });
  const [played, setPlayed] = useState<string[]>(() => {
    try {
      const item = localStorage.getItem(LS_KEYS.played);
      return item ? (JSON.parse(item) as string[]) : [];
    } catch (error) {
      localStorage.setItem(LS_KEYS.played, "[]");
      return [];
    }
  });
  const [assigned, setAssigned] = useState<string[]>(() => {
    try {
      const item = localStorage.getItem(LS_KEYS.assigned);
      return item ? (JSON.parse(item) as string[]) : [];
    } catch (error) {
      localStorage.setItem(LS_KEYS.assigned, "[]");
      return [];
    }
  });

  const [selected, setSelected] = React.useState<string>();

  const [participants, setParticipants] = React.useState<string[]>(() => {
    try {
      const item = localStorage.getItem(LS_KEYS.participants);
      return item ? (JSON.parse(item) as string[]) : [];
    } catch (error) {
      localStorage.setItem(LS_KEYS.participants, "[]");
      return [];
    }
  });

  const onParticipantAdd = () => {
    const participant = inputRef.current?.value;

    if (!participant) {
      toast.error("Ups!, te has olvidado del nombre!");
      return;
    }

    if (participants?.includes(participant)) {
      toast.error("Tu nombre ya está en la lista de participantes!");
      return;
    }

    inputRef.current.value = "";

    const normalizedParticipant = participant
      .split(" ")
      .map((word) => {
        if (word && word.length > 1) {
          return word.trim()[0]?.toUpperCase() + word.slice(1).toLowerCase();
        }
      })
      .join(" ");

    setParticipants([...participants, normalizedParticipant]);

    localStorage.setItem(
      LS_KEYS.participants,
      JSON.stringify([...participants, normalizedParticipant]),
    );

    toast.success("Esooo!, ya estás en la lista!", {
      style: {
        border: "1px solid #713200",
        padding: "16px",
        color: "#713200",
      },
      iconTheme: {
        primary: "#713200",
        secondary: "#FFFAEE",
      },
    });
  };

  const onParticipantRemove = (participant: string, index: number) => {
    if (gameStarted) {
      toast.error(
        "No puedes eliminar participantes una vez iniciado el juego.",
      );
      return;
    }

    setParticipants((prev) => {
      const newParticipants = [...prev];
      newParticipants.splice(index, 1);
      return newParticipants;
    });

    localStorage.setItem(
      LS_KEYS.participants,
      JSON.stringify([...participants.filter((p) => p !== participant)]),
    );
  };

  const onGameStart = () => {
    if (participants?.length % 2 !== 0) {
      toast.error(
        "El número de participantes debe ser par para iniciar el juego.",
      );
      return;
    }

    localStorage.setItem(LS_KEYS.gamestarted, "true");
    setGameStarted(true);
  };

  const onGameEnd = () => {
    localStorage.setItem(LS_KEYS.gamestarted, "false");
    setGameStarted(false);
    localStorage.setItem(LS_KEYS.played, "[]");
    setPlayed([]);
    localStorage.setItem(LS_KEYS.assigned, "[]");
    setAssigned([]);
  };

  const onSecretFriendReveal = () => {
    try {
      if (!selected) {
        toast.error("Por favor, selecciona tu nombre de la lista.");
        return;
      }

      if (played.includes(selected)) {
        toast.error("Ya has jugado!");
        return;
      }

      // Filtrar la lista de participantes
      const availableParticipants = participants.filter(
        (p) => p !== selected && !assigned.includes(p),
      );

      if (availableParticipants.length === 0) {
        toast.error("No hay más amigos secretos disponibles.");
        return;
      }

      // Elegir un amigo secreto al azar
      const secretFriend =
        availableParticipants[
          Math.floor(Math.random() * availableParticipants.length)
        ];

      if (!secretFriend) {
        toast.error("No hay más amigos secretos disponibles.");
        return;
      }

      localStorage.setItem(
        LS_KEYS.assigned,
        JSON.stringify([...assigned, secretFriend]),
      );
      setAssigned([...assigned, secretFriend]);

      localStorage.setItem(
        LS_KEYS.played,
        JSON.stringify([...played, selected]),
      );
      setPlayed([...played, selected]);

      // Mostrar al amigo secreto
      toast.success(`Tu amigo secreto es: ${secretFriend}`);
    } catch (error) {
      console.error("Error en el juego de amigo secreto: ", error);
      localStorage.setItem(LS_KEYS.played, "[]");
      localStorage.setItem(LS_KEYS.assigned, "[]");

      toast.error("Ocurrió un error inesperado.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white/10 p-4">
      <p className="mb-5 max-w-lg text-center text-sm text-white">
        ¡Añade tu nombre y el de tus amigos para descubrir quién será tu amigo
        secreto! Simplemente selecciona tu nombre de la lista y revela la
        sorpresa. ¿Listo para la diversión?
      </p>
      <div className="w-full max-w-sm space-y-3 text-center">
        <Label className="sr-only" htmlFor="name">
          Nombre
        </Label>
        <Input
          ref={inputRef}
          id="name"
          placeholder="Introduce un nombre"
          required
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onParticipantAdd();
            }
          }}
          className={cn(
            "placeholder:font-serif2 border-white/30 bg-white/20 placeholder:text-xl placeholder:text-white",
            {
              hidden: gameStarted,
            },
          )}
        />
        <Button
          variant="default"
          className={cn("font-serif2 mb-4 w-full text-xl font-bold", {
            hidden: gameStarted,
          })}
          onClick={onParticipantAdd}
        >
          Incluir participante
        </Button>

        <Button
          variant="secondary"
          disabled={participants?.length === 0}
          className={cn("font-serif2 rounded-full text-xl font-bold", {
            hidden: gameStarted,
          })}
          onClick={onGameStart}
        >
          Iniciar el juego!
        </Button>

        {gameStarted && participants?.length > 0 && (
          <>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  className="font-serif2 w-full text-xl font-bold"
                >
                  Revelar amigo secreto
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gradient-to-b from-[#123a4d] to-[#15162c] text-white ">
                <DialogHeader>
                  <DialogTitle>
                    A un paso de conocer tu amigo secreto!
                  </DialogTitle>
                  <DialogDescription className="text-white">
                    Elije tu nombre de la lista, y te diremos quién es tu amigo
                    secreto.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Select onValueChange={setSelected}>
                    <SelectTrigger className="font-serif2 border-white/70 bg-[#123a4d]/80 text-xl placeholder:text-xl placeholder:text-white">
                      <SelectValue
                        placeholder="¿Quién eres?, elige tu nombre 👇🏻"
                        className="placeholder:font-serif2 text-xl"
                      />
                    </SelectTrigger>
                    <SelectContent className="placeholder:font-serif2 border-white/70 bg-gradient-to-b from-[#123a4d]/95 to-[#15162c]/95 placeholder:text-xl placeholder:text-white">
                      {participants.map((participant, i) => (
                        <SelectItem
                          key={i}
                          value={participant}
                          className={cn("font-serif2 text-xl text-white", {
                            "line-through": played.includes(participant),
                          })}
                        >
                          {participant}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    onClick={onSecretFriendReveal}
                    className="font-serif2 w-full text-xl font-bold"
                  >
                    Revelar! 🎉
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              variant="link"
              className={cn("w-full font-sans text-white underline ", {})}
              onClick={onGameEnd}
            >
              Terminar el juego!
            </Button>
          </>
        )}
      </div>

      <div className="mt-10 w-full max-w-sm">
        <h2 className="mb-4 font-serif text-4xl font-bold">Participantes</h2>
        {participants?.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4">
            {participants?.map((participant, i) => (
              <Badge key={i} className="group relative">
                <span className="text-base transition-all duration-300 group-hover:mr-5">
                  {participant}
                </span>

                <button
                  onClick={() => onParticipantRemove(participant, i)}
                  className="absolute right-1 hidden h-5 w-5 items-center justify-center rounded-full bg-white text-red-950 transition-all duration-300 hover:bg-white/70 group-hover:flex"
                >
                  <XIcon />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-center text-white">
            No hay nadie de momento, anímate a participar!
          </p>
        )}
      </div>

      <div className="mt-10 w-full max-w-sm">
        <h2 className="mb-4 font-serif text-4xl font-bold">Resumen</h2>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <p className="text-base text-white">Total de Participantes</p>
            <p className="text-base text-white">{participants?.length}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-base text-white">
              Participantes que ¡Ya Jugaron!
            </p>
            <p className="text-base text-white">{played?.length ?? 0}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-base text-white">Amigos Secretos Asignados</p>
            <p className="text-base text-white">{assigned?.length ?? 0}</p>
          </div>
        </div>
      </div>

      <p className="mt-10 text-sm text-white">
        Made with ❤️ by{" "}
        <Link className="underline" href="#">
          Ruslan
        </Link>
      </p>
    </div>
  );
}
