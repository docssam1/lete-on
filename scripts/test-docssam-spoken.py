"""Regression checks for the actual board/science narration number readings."""
from pathlib import Path
import runpy
import unittest

spoken = runpy.run_path(str(Path(__file__).with_name("omnivoice-docssam.py")))["spoken"]


class SpokenNumbersTest(unittest.TestCase):
    def test_clock_two_digit_numbers(self):
        self.assertEqual(spoken("10, 11, 12"), "십, 십일, 십이")

    def test_clock_range(self):
        self.assertEqual(spoken("1부터 12까지, 12가 맨 위"), "일부터 십이까지, 십이가 맨 위")

    def test_rotated_two_digit_number(self):
        self.assertEqual(spoken("16은 91이 돼요."), "십육은 구십일이 돼요.")

    def test_science_elapsed_time(self):
        self.assertEqual(spoken("40분 뒤 부피를 읽어요."), "사십분 뒤 부피를 읽어요.")

    def test_number_suffixes_do_not_split_whole_integers(self):
        self.assertEqual(spoken("15분 25분 3학년 6학년 3분의 1 0에"),
                         "십오분 이십오분 삼학년 육학년 삼분의 일 영에")

    def test_single_digits(self):
        self.assertEqual(spoken("0 1 2 3 4 5 6 7 8 9"), "영 일 이 삼 사 오 육 칠 팔 구")

    def test_existing_abbreviations(self):
        self.assertEqual(spoken("3D QR N과 S O/X"), "쓰리디 큐알 엔과 에스 오/엑스")

    def test_integer_units(self):
        self.assertEqual(spoken("2026 10000 100000000"), "이천이십육 만 일억")


if __name__ == "__main__":
    unittest.main()
