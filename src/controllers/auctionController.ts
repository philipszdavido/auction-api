import { Request, Response } from "express";

export const status = (req: Request, res: Response) => {
  res.json({ message: "Status" });
};

export const history = (req: Request, res: Response) => {
  res.json({ message: "History" });
};

export const submitBid = (req: Request, res: Response) => {
  res.json({ message: "Submit bid" });
};

export const statistics = (req: Request, res: Response) => {
  res.json({ message: "Statistics" });
};
