export enum Side {
  WHITE,
  BLACK,
  NONE
}

export enum Type {
  EMPTY,
  KING,
  BISHOP,
  ROOK,
  PAWN,
  SUPERPAWN
}

type State = "none" | "selected" | "available" | "attacked";

const N = [-1, 0];
const S = [1, 0];
const E = [0, 1];
const W = [0, -1];
const NE = [-1, 1];
const NW = [-1, -1];
const SE = [1, 1];
const SW = [1, -1];

export class Piece {
  static get EMPTY(): Piece { return new Piece(Side.NONE, Type.EMPTY); };
  static get B_KING(): Piece { return new Piece(Side.BLACK, Type.KING); };
  static get B_BISHOP(): Piece { return new Piece(Side.BLACK, Type.BISHOP); };
  static get B_ROOK(): Piece { return new Piece(Side.BLACK, Type.ROOK); };
  static get B_PAWN(): Piece { return new Piece(Side.BLACK, Type.PAWN); };
  static get B_SUPERPAWN(): Piece { return new Piece(Side.BLACK, Type.SUPERPAWN); };
  static get W_KING(): Piece { return new Piece(Side.WHITE, Type.KING); };
  static get W_BISHOP(): Piece { return new Piece(Side.WHITE, Type.BISHOP); };
  static get W_ROOK(): Piece { return new Piece(Side.WHITE, Type.ROOK); };
  static get W_PAWN(): Piece { return new Piece(Side.WHITE, Type.PAWN); };
  static get W_SUPERPAWN(): Piece { return new Piece(Side.WHITE, Type.SUPERPAWN); };
  public static get START_POSITIONS(): any[][] {
      return [
          [Piece.B_BISHOP, Piece.B_KING, Piece.B_ROOK],
          [Piece.EMPTY, Piece.B_PAWN, Piece.EMPTY],
          [Piece.EMPTY, Piece.W_PAWN, Piece.EMPTY],
          [Piece.W_ROOK, Piece.W_KING, Piece.W_BISHOP],
      ];
  } 

  side: Side;
  type: Type;
  state: State = "none";

  constructor(side: Side, type: Type) {
    this.side = side;
    this.type = type;
  }

  text() {
      return this.side + " " + this.type;
  }

  img() {
      return "img/" + this.side_to_string() + "_" + this.type_to_string() + ".png";
  }

  side_to_string(): string {
      return Piece.side_to_string(this.side);
  }

  static side_to_string(side: Side): string {
      switch (side){
          case Side.BLACK:
          return "b";
          case Side.WHITE:
          return "w";
          case Side.NONE:
          return "n"
      }
  }

  type_to_string(): string {
      switch (this.type){
          case Type.EMPTY:
          return "empty";
          case Type.KING:
          return "king";
          case Type.BISHOP:
          return "bishop";
          case Type.ROOK:
          return "rook";
          case Type.PAWN:
          return "pawn";
          case Type.SUPERPAWN:
          return "superpawn";
      }
  }

  movements(): number[][] {
      switch (this.type){
          case Type.KING:
          return [N, S, E, W, NE, NW, SE, SW];
          case Type.BISHOP:
          return [NE, NW, SE, SW];
          case Type.ROOK:
          return [N, S, E, W];
          case Type.PAWN:
          return this.side == Side.BLACK ? [S] : [N];
          case Type.SUPERPAWN:
          if (this.side == Side.BLACK) {
              return [N, S, E, W, SE, SW];
          } else {
              return [N, S, E, W, NE, NW];              
          }
          case Type.EMPTY:
          default:
          return [];
      }
  }

  canBeSelected(): boolean {
    return this.type != Type.EMPTY;
  }

  getOpposite(): Piece {
      return new Piece(this.side == Side.BLACK ? Side.WHITE : Side.BLACK, this.type);
  }
}
